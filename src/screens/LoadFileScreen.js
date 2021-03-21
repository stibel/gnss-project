import React, {useState, useEffect} from 'react';
import {ToastContainer} from "react-toastify";
import {ThemeProvider} from "styled-components";
import sem from 'gps-sem-parser';

import mainTheme from "../styles/main";
import PageWrapper from "../styles/Page";
import Button from "../styles/Button";
import ToastError from "../services/SignalErrorService";
import GetTopocentricCoordinatesService from "../services/GetTopocentricCoordinatesService";
import GetDOPService from "../services/GetDOPService";

const LoadFileScreen = (props) => {

    const [alm, setAlm] = useState();
    const [fileLoaded, setFileLoaded] = useState(false);
    const [sats, setSats] = useState([]);
    const [DOP, setDOP] = useState(null);

    const read = async () => {
        const data = await fetch('./data/data.sem');
        const text = await data.text();
        setAlm(sem(text));
        setFileLoaded(true);
    }

    useEffect(() => {
            console.log(alm);
        }, [alm])

    const setSatellites = () => {
        if (!fileLoaded)
            ToastError("Load the file first!");
        else
            setSats([...GetTopocentricCoordinatesService(false, alm)]);
    }

    const setDilution = () => {
        if (!fileLoaded || sats === [])
            ToastError("Load the file first!");
        else
            setDOP(GetDOPService(sats));
    }

    useEffect(() => {
        console.log(sats);
    }, [sats])

    useEffect(() => {
        console.log(DOP);
    }, [DOP])

    return (
        <div>
            <ThemeProvider theme={mainTheme}>
            <PageWrapper >
                <Button onClick={read}>
                    Odczytaj plik
                </Button>
                <Button onClick={setSatellites}>
                    Oblicz parametry satelitów
                </Button>
                <Button onClick={setDilution}>
                    Oblicz DOP
                </Button>
            </PageWrapper>
        </ThemeProvider>
            <ToastContainer />
        </div>
    )
}

export default LoadFileScreen