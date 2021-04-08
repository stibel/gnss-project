import React, {useState, useEffect, useRef} from 'react';
import {ToastContainer} from "react-toastify";
import sem from 'gps-sem-parser';
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
    font-family: ${props => props.theme.fonts.family};
    padding: 10%;
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
    const [fileLoaded, setFileLoaded] = useState(false);
    const [sats, setSats] = useState([]);
    const [DOP, setDOP] = useState(null);
    const [receiver, setReceiver] = useState(null);
    const week = useRef(null);
    const toa = useRef(null);
    const phi = useRef(null);
    const lambda = useRef(null);
    const h = useRef(null);

    useEffect(() => {
        console.log(alm);
    }, [alm])

    const read = async () => {
        const data = await fetch('./data/data.sem');
        const text = await data.text();
        setAlm(sem(text));
        setFileLoaded(true);
        Toast("File loaded!", 's');

    }

    const setSatellites = () => {
        if (!fileLoaded)
            Toast("Load the file first!", 'w');
        else {
            setSats([...GetTopocentricCoordinatesService(false, alm)]);
            Toast("Parameters calculated", 's');
        }
    }

    const setDilution = () => {
        if (!fileLoaded || !sats.length)
            Toast("Load the file and calculate parameters first!", 'w');
        else {
            setDOP(GetDOPService(sats, receiver));
            Toast("DOP calculated!", 's');
        }
    }

    useEffect(() => {
        console.log(sats);
    }, [sats])

    useEffect(() => {
        console.log(DOP);
    }, [DOP])

    useEffect(() => {
        console.log(receiver);
    }, [receiver])

    const log = () => {
        console.log(week.current.value, toa.current.value, phi.current.value, lambda.current.value, h.current.value);
    }

    const handleReceiverInput = () => {
        if (isNaN(phi.current.value) || phi.current.value === ''||  isNaN(lambda.current.value) || lambda.current.value === '' || isNaN(h.current.value) || h.current.value === '')
            Toast('Provide correct receiver coordinates', 'w')
        else
            setReceiver({phi: phi.current.value, lambda: lambda.current.value, h: h.current.value});

    }

    return (
        <>
        <PageWrapper>
            <InputWrapper>
                <Input ref={week}/>
                <Input ref={toa} list={"toa"}/>
                <datalist id="toa">
                    <option value="061440"/>
                    <option value="147456"/>
                    <option value="233472"/>
                    <option value="319488"/>
                    <option value="405504"/>
                    <option value="503808"/>
                    <option value="589824"/>
                </datalist>
                <Button onClick={log} />
                <Input ref={phi} />
                <Input ref={lambda} />
                <Input ref={h} />
                <Button onClick={handleReceiverInput} />
            </InputWrapper>
            <ButtonsWrapper>
                <Button onClick={read}>
                    Odczytaj plik
                </Button>
                <Button onClick={setSatellites}>
                    Oblicz parametry satelitów
                </Button>
                <Button onClick={setDilution}>
                    Oblicz DOP
                </Button>
                <Button style={{opacity: "75%", cursor: "not-allowed"}} onClick={() => Toast("Under construction")}>
                    Narysuj wykresy
                </Button>
            </ButtonsWrapper>
        </PageWrapper>
        <ToastContainer />
        </>
    )
}

export default LoadFileScreen