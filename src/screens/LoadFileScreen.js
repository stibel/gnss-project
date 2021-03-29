import React, {useState, useEffect} from 'react';
import {ToastContainer} from "react-toastify";
import sem from 'gps-sem-parser';
import styled from "styled-components";

import PageWrapper from "../styles/Page";
import Button from "../styles/Button";
import Toast from "../services/SignalService";
import GetTopocentricCoordinatesService from "../services/GetTopocentricCoordinatesService";
import GetDOPService from "../services/GetDOPService";

const ButtonsWrapper = styled.main`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 25%);
  justify-items: center;
  align-items: center;
  align-self: center;
  place-items: center;
`

const LoadFileScreen = props => {

    const [alm, setAlm] = useState();
    const [fileLoaded, setFileLoaded] = useState(false);
    const [sats, setSats] = useState([]);
    const [DOP, setDOP] = useState(null);

    const read = async () => {
        const data = await fetch('./data/data.sem');
        const text = await data.text();
        setAlm(sem(text));
        setFileLoaded(true);
        Toast("File loaded!", 's');
    }

    useEffect(() => {
            console.log(alm);
        }, [alm])

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
            setDOP(GetDOPService(sats));
            Toast("DOP calculated!", 's');
        }
    }

    useEffect(() => {
        console.log(sats);
    }, [sats])

    useEffect(() => {
        console.log(DOP);
    }, [DOP])

    return (
        <>
        <PageWrapper>
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
                <Button style={{opacity: "75%"}} onClick={() => Toast("Under construction")}>
                    Narysuj wykresy
                </Button>
            </ButtonsWrapper>
        </PageWrapper>
        <ToastContainer />
        </>
    )
}

export default LoadFileScreen