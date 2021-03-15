import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import styled from "styled-components";
import sem from 'gps-sem-parser';

import GetSatelliteECEFCoordinatesService from "../services/GetSatelliteECEFCoordinatesService";
import GetTopocentricCoordinatesService from "../services/GetTopocentricCoordinatesService";

const PageWrapper = styled.main`
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow: column;
  width: 100vw;
  height: 90vh;
`

export const ButtonWrapper = styled.div`
  cursor: pointer;
  -webkit-text-fill-color: red;
`

const LoadFileScreen = (props) => {

    const [alm, setAlm] = useState();
    const [fileLoaded, setFileLoaded] = useState(false);
    let EFECCoords = [];

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
    }

    return (
        <PageWrapper>
            <div>
                load file
            </div>
            <ButtonWrapper onClick={read}>
                Odczytaj plik
            </ButtonWrapper>
            <Link to={"/"}>
                wstecz
            </Link>
            {/*<ButtonWrapper onClick={GetTopocentricCoordinatesService}>*/}
            {/*    test*/}
            {/*</ButtonWrapper>*/}
        </PageWrapper>
    )
}

export default LoadFileScreen