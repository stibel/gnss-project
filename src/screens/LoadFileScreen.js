import React, {useState, useEffect} from 'react';
import {ToastContainer} from "react-toastify";
import styled, {ThemeProvider} from "styled-components";
import sem from 'gps-sem-parser';

import mainTheme from "../styles/main";
import PageWrapper from "../styles/Page";
import Button from "../styles/Button";
import ToastError from "../services/SignalErrorService";
import GetSatelliteECEFCoordinatesService from "../services/GetSatelliteECEFCoordinatesService";
import GetTopocentricCoordinatesService from "../services/GetTopocentricCoordinatesService";

export const ButtonWrapper = styled.div`
  cursor: pointer;
  -webkit-text-fill-color: red;
`

const LoadFileScreen = (props) => {

    const [alm, setAlm] = useState();
    const [fileLoaded, setFileLoaded] = useState(false);
    const [sats, setSats] = useState([]);
    const [areSet, setAreSet] = useState(false);
    let satsTemp = [];

    console.log(fileLoaded);
    const read = () => {
        fetch('./data/data.sem')
            .then(res => {res.text()
                .then(alm => setAlm(sem(alm)))
                .then(fileLoaded => setFileLoaded(true));
        });
    }

    useEffect(() => {
            console.log(alm);
        }, [alm])

    const set  = () => {
        if (!fileLoaded) {
            ToastError("Load the file first!");
        }
        else {
            setSats([...GetTopocentricCoordinatesService(false, alm)]);
        }
    }

    useEffect(() => {
        console.log(fileLoaded);
    }, [fileLoaded])

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
                    test
                </Button>
            </PageWrapper>
        </ThemeProvider>
            <ToastContainer />
        </div>
    )
}

export default LoadFileScreen