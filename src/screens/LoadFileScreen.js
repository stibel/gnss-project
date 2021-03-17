import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import styled, {ThemeProvider} from "styled-components";
import sem from 'gps-sem-parser';

import mainTheme from "../styles/main";
import PageWrapper from "../styles/Page";
import Button from "../styles/Button";
import GetSatelliteECEFCoordinatesService from "../services/GetSatelliteECEFCoordinatesService";
import GetTopocentricCoordinatesService from "../services/GetTopocentricCoordinatesService";

export const ButtonWrapper = styled.div`
  cursor: pointer;
  -webkit-text-fill-color: red;
`

const LoadFileScreen = (props) => {

    const [alm, setAlm] = useState();
    const [fileLoaded, setFileLoaded] = useState(false);
    let EFECCoords = [];
    let topo = [];

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

    if (fileLoaded) {
        EFECCoords = GetSatelliteECEFCoordinatesService(alm);
        topo = GetTopocentricCoordinatesService(false, EFECCoords[0]);
    }

    return (
        <ThemeProvider theme={mainTheme}>
            <PageWrapper >
                <Button onClick={read}>
                    Odczytaj plik
                </Button>
                <Button onClick={console.log(EFECCoords + " topo: " + topo)}>
                    test
                </Button>
            </PageWrapper>
        </ThemeProvider>
    )
}

export default LoadFileScreen