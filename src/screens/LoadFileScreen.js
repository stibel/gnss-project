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

    const read = async () => {
        const data = await fetch('./data/data.sem');
        const text = await data.text();
        setAlm(sem(text));
        setFileLoaded(true);
    }

    useEffect(() => {
            console.log(alm);
        }, [alm])

    const set  = () => {
        if (!fileLoaded)
            ToastError("Load the file first!");
        else
            setSats([...GetDOPService(false, alm)]);
    }

    useEffect(() => {
        console.log(sats);
    }, [sats])

    return (
        <div>
            <ThemeProvider theme={mainTheme}>
            <PageWrapper >
                <Button onClick={read}>
                    Odczytaj plik
                </Button>
                <Button onClick={set}>
                    Oblicz
                </Button>
            </PageWrapper>
        </ThemeProvider>
            <ToastContainer />
        </div>
    )
}

export default LoadFileScreen