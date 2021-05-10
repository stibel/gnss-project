import React, {useEffect, useRef, useState} from 'react';
import {Switch, Route, useRouteMatch, useHistory} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import sem from 'gps-sem-parser';
import axios from "axios";
import styled from "styled-components";
import DatePicker from "react-date-picker";
import {add, differenceInMinutes, sub} from "date-fns";

import PageWrapper from "../styles/Page";
import Button from "../components/Button";
import ButtonRect from "../styles/ButtonRect";
import Input from "../styles/Input";
import Toast from "../services/SignalService";
import GetTopocentricCoordinatesService from "../services/GetTopocentricCoordinatesService";
import GetDOPService from "../services/GetDOPService";
import mainTheme from "../styles/main";
import ChartsScreen from "./ChartsScreen";

const InputWrapper = styled.div`
  display: flex;
  flex-flow: column;
  text-align: center;
  justify-content: space-evenly;
  margin: 2% 0 0 2%;
  height: auto;
  width: 30vw;
  font-family: ${props => props.theme.fonts.family};
  font-size: ${props => props.theme.fonts.size.s};
  background-color: #1D1135;
  padding: 7%;
  align-items: center;
  border-radius: 5%;
  filter: drop-shadow(0 0 1vh ${props => props.theme.colours.detailsTwo});
`

const Label = styled.div`
  display: flex;
  flex-flow: row;
  font-size: ${props => props.theme.fonts.size.m};
  height: ${props => props.theme.fonts.size.l};
`

const ButtonWrapper = styled.main`
  padding: 20% 20% 20% 30%;
  width: 100%;
  display: flex;
  flex-flow: row;
  justify-items: center;
  align-items: center;
  align-self: center;
  place-items: center;
`

const LoadFileScreen = props => {
    const {path, url} = useRouteMatch();
    const history = useHistory();
    const [alm, setAlm] = useState(null);
    const [chartsData, setChartsData] = useState(null);
    const [receiver, setReceiver] = useState(null);
    const [date, setDate] = useState(new Date());
    const week = useRef(null);
    const toa = useRef(null);
    const year = useRef(null);
    const phi = useRef(null);
    const lambda = useRef(null);
    const h = useRef(null);
    const observationMask = useRef(null);

    useEffect(() => {
        axios.get('https://cors.bridged.cc/https://www.navcen.uscg.gov/?pageName=currentAlmanac&format=sem-txt')
            .then(res => setAlm(sem(res.data)))
            .catch(err => console.error(err));
    }, [])

    useEffect(() => {
        if(alm) {
            Toast(`Almanach set! Week: ${alm.gpsWeek}, ToA: ${alm.toa}`)
            console.log(alm);
            week.current.value = alm.gpsWeek;
            toa.current.value = alm.toa;
            year.current.value = date.getFullYear();
        }
    }, [alm])

    useEffect(() => {
        console.log(chartsData);
    }, [chartsData])

    useEffect(() => {
        console.log(receiver);
    }, [receiver])

    const getLocation = () => {
        if (!navigator.geolocation) {
            Toast('Geolocation is not supported by your browser', 'e');
        } else {
            navigator.geolocation.getCurrentPosition((position) => {
                phi.current.value = position.coords.latitude;
                lambda.current.value = position.coords.longitude;
            }, (e) => {
                console.error(e);
            });
        }
    }

    const getClosestTime = provided => {
        const arr = [61440, 147456, 233472, 319488, 405504, 503808, 589824];

        return arr.reduce((prev, curr) => {
            return (Math.abs(curr - provided) < Math.abs(prev - provided) ? curr : prev);
        });
    }

    const handleTimeInput = () => {
        if (isNaN(week.current.value) || week.current.value === '' || week.current.value < 0 || isNaN(toa.current.value) || toa.current.value === '')
            Toast('Provide correct week and ToA value!', 'w')
        else {
            //what follows solves the problem of only constant times at which almanac is provided, in case the user provides
            //a week greater than 1023 or wrong toa values closest to those will be chosen
            week.current.value = week.current.value % 1024;
            toa.current.value = getClosestTime(toa.current.value);
            Toast(`Week set to ${week.current.value}, ToA set to ${toa.current.value}`, 's');
        }

    }

    const handleReceiverInput = () => {
        if (isNaN(phi.current.value) || phi.current.value === ''||  isNaN(lambda.current.value) || lambda.current.value === '' || isNaN(h.current.value) || h.current.value === '')
            Toast('Provide correct receiver coordinates and observation mask!', 'w')
        else {
            h.current.value = h.current.value < 0 ? 0 : h.current.value
            phi.current.value = phi.current.value % 90
            lambda.current.value = lambda.current.value % 180
            setReceiver({
                phi: Number(phi.current.value),
                lambda: Number(lambda.current.value),
                h: Number(h.current.value)
            });
            Toast(`Receiver set: (${phi.current.value}, ${lambda.current.value}, ${h.current.value})`, 's');
        }

    }

    const read = async () => {
        handleTimeInput()
        if (!toa.current.value || !week.current.value)
            Toast('Provide GPS week and ToA!', 'e');
        let t = toa.current.value.toString();
        let w = week.current.value.toString();
        const y = year.current.value.toString();
        if (t.length === 5)
            t = '0' + t;
        if (w.length < 4)
            w.length < 3 ? w = '00' + w : w = '0' + w;

        const url = `https://cors.bridged.cc/https://celestrak.com/GPS/almanac/SEM/${y}/almanac.sem.week${w}.${t}.txt`;
        // console.log(url);
        let data
        await axios.get(url).then(res => data = res.data).catch(err => console.error(err))

        try {
            setAlm(sem(data));
        } catch (e) {
            console.error(e)
            Toast('Unable to set almanach. Currently only working on almanachs from 2021.', 'e');
        }
    }

    const count = async () => {
        if (!alm || !receiver) {
            Toast("Set almanach and provide receiver coordinates!", 'w');
            return
        }
        let data = [];
        const startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        let time = new Date(startTime);
        observationMask.current.value = observationMask.current.value < 0 ? 0 : observationMask.current.value;
        const mask = observationMask.current.value;
        while (differenceInMinutes(time, startTime) < 24 *  60 + 1) {
            const sats = GetTopocentricCoordinatesService(receiver, alm, time);
            const visibleSats = sats.filter((item) => item.el > mask);
            const DOPs = GetDOPService(visibleSats, receiver);
            console.log(DOPs)
            data.push({t: time, s: sats, v: visibleSats, d: {...DOPs}});

            time = add(time, {minutes: 10});
        }
        console.log(data)
        setChartsData([...data]);
    }

    useEffect(() => {
        if(chartsData)
            history.push(`${path}/Charts`)
    }, [chartsData]);

    return (
        <Switch>
            <Route exact path={"/Load"}>
            <PageWrapper>
                <div style={{flexFlow: 'column', height: '90vh'}}>
                    <InputWrapper>
                        <div style={{fontSize: mainTheme.fonts.size.l}}>
                            Almanach
                        </div>
                        <Label>
                            <div style={{width: '10vw'}}>Tydzień&nbsp;GPS</div>
                            <Input ref={week}/>
                        </Label>
                        <Label>
                            <div style={{width: '10vw'}}>ToA</div>
                            <Input ref={toa} list={"toa"}/>
                        </Label>
                        <Label>
                            <div style={{width: '10vw'}}>Rok</div>
                            <Input ref={year}/>
                        </Label>
                        <datalist id="toa">
                            <option value="61440"/>
                            <option value="147456"/>
                            <option value="233472"/>
                            <option value="319488"/>
                            <option value="405504"/>
                            <option value="503808"/>
                            <option value="589824"/>
                        </datalist>
                        <div>
                            <ButtonRect onClick={read}>Wczytaj almanach</ButtonRect>
                        </div>
                    </InputWrapper>
                    <InputWrapper>
                        <div style={{fontSize: mainTheme.fonts.size.l}}>
                            Odbiornik
                        </div>
                        <Label>
                            <div style={{width: '15vw'}}>Phi</div>
                            <Input ref={phi}/>
                        </Label>
                        <Label>
                            <div style={{width: '15vw'}}>Lambda</div>
                            <Input ref={lambda}/>
                        </Label>
                        <Label>
                            <div style={{width: '15vw'}}>H</div>
                            <Input ref={h}/>
                        </Label>
                        <Label>
                            <div style={{width: '15vw'}}>Maska&nbsp;obserwacji</div>
                            <Input ref={observationMask}/>
                        </Label>
                            <div style={{display: 'flex', flexFlow: 'row'}}>
                                <ButtonRect onClick={getLocation}>Ustaw automatyczne współrzędne</ButtonRect>
                                <ButtonRect onClick={handleReceiverInput}>Ustaw pozycję odbiornika</ButtonRect>
                            </div>
                            <div style={{fontSize: mainTheme.fonts.size.l}}>
                                Data
                            </div>
                            <div style={{backgroundColor: mainTheme.colours.details}}>
                                <DatePicker value={date} onChange={setDate} required={true} showLeadingZeros={true}
                                            minDate={sub(new Date(), {months: 3})}
                                            maxDate={add(new Date(), {months: 3})}/>
                            </div>
                        </InputWrapper>
                    </div>
                    <ButtonWrapper>
                        <Button onClick={count}>
                            Oblicz
                        </Button>
                    </ButtonWrapper>
            </PageWrapper>
            <ToastContainer />
            </Route>
            <Route path={`${path}/Charts`}>
                <ChartsScreen data={chartsData} />
            </Route>
        </Switch>
    )
}

export default LoadFileScreen