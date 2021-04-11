import React, {useEffect, useRef, useState} from 'react';
import {ToastContainer} from "react-toastify";
import sem from 'gps-sem-parser';
import axios from "axios";
import styled from "styled-components";

import PageWrapper from "../styles/Page";
import Button from "../styles/Button";
import Input from "../styles/Input";
import Toast from "../services/SignalService";
import GetTopocentricCoordinatesService from "../services/GetTopocentricCoordinatesService";
import GetDOPService from "../services/GetDOPService";

const InputWrapper = styled.div`
  display: flex;
  flex-flow: column;
  text-align: center;
  justify-content: space-evenly;
  margin: 2% 0 0 2%;
  height: 10vh;
  font-family: ${props => props.theme.fonts.family};
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
  height: ${props => props.theme.fonts.size.m};
`

const ButtonsWrapper = styled.main`
  width: 100%;
  display: flex;
  flex-flow: row;
  justify-items: center;
  align-items: center;
  align-self: center;
  place-items: center;
`

const LoadFileScreen = props => {

    const [alm, setAlm] = useState(null);
    const [sats, setSats] = useState([]);
    const [DOP, setDOP] = useState(null);
    const [receiver, setReceiver] = useState(null);
    const week = useRef(null);
    const toa = useRef(null);
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
        }
    }, [alm])

    useEffect(() => {
        console.log(sats);
    }, [sats])

    useEffect(() => {
        console.log(DOP);
    }, [DOP])

    useEffect(() => {
        console.log(receiver);
    }, [receiver])

    const getClosestTime = provided => {
        const arr = [61440, 147456, 233472, 319488, 405504, 503808, 589824];

        return arr.reduce((prev, curr) => {
            return (Math.abs(curr - provided) < Math.abs(prev - provided) ? curr : prev);
        });
    }

    const handleTimeInput = () => {
        if (isNaN(week.current.value) || week.current.value === '' || week.current.value < 0)
            Toast('Provide correct week value!', 'w')
        else {
            //what follows solves the problem of only constant times at which almanac is provided, in case the user provides
            //a week greater than 1023 or wrong toa values closest to those will be chosen
            week.current.value = week.current.value % 1024;
            toa.current.value = getClosestTime(toa.current.value);
            Toast(`Week set to ${week.current.value}, ToA set to ${toa.current.value}`, 's');
        }

    }

    const handleReceiverInput = () => {
        if (isNaN(phi.current.value) || phi.current.value === ''||  isNaN(lambda.current.value) || lambda.current.value === '' || isNaN(h.current.value) || h.current.value === '' || isNaN(observationMask.current.value) || observationMask.current.value === '' || observationMask.current.value < 0)
            Toast('Provide correct receiver coordinates and observation mask!', 'w')
        else {
            h.current.value = h.current.value < 0 ? 0 : h.current.value
            phi.current.value = phi.current.value % 90
            lambda.current.value = lambda.current.value % 180
            setReceiver({
                phi: phi.current.value,
                lambda: lambda.current.value % 180,
                h: h.current.value,
                mask: observationMask.current.value
            });
                Toast(`Receiver set: (${phi.current.value}, ${lambda.current.value}, ${h.current.value}), mask: ${observationMask.current.value}`, 's');
        }

    }

    const read = async () => {
        handleTimeInput()
        if (!toa.current.value || !week.current.value)
            Toast('Provide GPS week and ToA!', 'e');
        let t = toa.current.value.toString();
        let w = week.current.value.toString();
        if (t.length === 5)
            t = '0' + t;
        if (w.length < 4)
            w.length < 3 ? w = '00' + w : w = '0' + w;

        const url = `https://cors.bridged.cc/https://celestrak.com/GPS/almanac/SEM/2021/almanac.sem.week${w}.${t}.txt`;
        console.log(url);
        let data
        await axios.get(url).then(res => data = res.data).catch(err => console.error(err))

        try {
            setAlm(sem(data));
        } catch (e) {
            console.error(e)
            Toast('Unable to set almanach. Currently only working on almanachs from 2021.', 'e');
        }
    }

    const setSatellites = () => {
        if (!alm || !receiver)
            Toast("Set almanach and provide receiver coordinates!", 'w');
        else {
            setSats([...GetTopocentricCoordinatesService(receiver, alm, observationMask)]);
            Toast("Parameters calculated", 's');
        }
    }

    const setDilution = () => {
        if (!alm || !sats.length || !receiver)
            Toast("Calculate parameters first!", 'w');
        else {
            setDOP(GetDOPService(sats, receiver));
            Toast("DOP calculated!", 's');
        }
    }

    return (
        <>
        <PageWrapper>
            <InputWrapper>
                    Almanach
                <Label>
                    <div style={{width: '10vw'}}>Tydzień&nbsp;GPS</div>
                    <Input ref={week}/>
                </Label>
                <Label>
                    <div style={{width: '10vw'}}>ToA</div>
                    <Input ref={toa} list={"toa"}/>
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
                    <Button onClick={read}>Wczytaj wybrany almanach</Button>
                </div>
            </InputWrapper>
            <InputWrapper>
                Odbiornik
                <Label>
                    <div style={{width: '15vw'}}>phi</div>
                    <Input ref={phi} />
                </Label>
                <Label>
                    <div style={{width: '15vw'}}>lambda</div>
                    <Input ref={lambda} />
                </Label>
                <Label>
                    <div style={{width: '15vw'}}>h</div>
                    <Input ref={h} />
                </Label>
                <Label>
                    <div style={{width: '15vw'}}>Maska&nbsp;obserwacji</div>
                    <Input ref={observationMask} />
                </Label>
                <div>
                    <Button onClick={handleReceiverInput}>Ustaw pozycję odbiornika</Button>
                </div>
            </InputWrapper>
            <InputWrapper>
                Parametry
            </InputWrapper>
            <ButtonsWrapper>
                {/*<Button onClick={read}>*/}
                {/*    Odczytaj plik*/}
                {/*</Button>*/}
                <Button onClick={setSatellites}>
                    Oblicz parametry satelitów
                </Button>
                <Button onClick={setDilution}>
                    Oblicz DOP
                </Button>
                {/*<Button style={{opacity: "75%", cursor: "not-allowed"}} onClick={() => Toast("Under construction")}>*/}
                {/*    Narysuj wykresy*/}
                {/*</Button>*/}
            </ButtonsWrapper>
        </PageWrapper>
        <ToastContainer />
        </>
    )
}

export default LoadFileScreen