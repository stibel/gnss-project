import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import styled from "styled-components";
import sem from 'gps-sem-parser';

import GetTimeService from "../services/GetTimeService";
import GetMeanMotionService from "../services/GetMeanMotionService";
import CorrectMeanAnomalyService from "../services/CorrectMeanAnomalyService";

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
    let calculatedValues = {};

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
        calculatedValues.tk = GetTimeService(alm.toa);
        calculatedValues.meanMotionArr = GetMeanMotionService(alm.satellites);
        calculatedValues.correctedAnomalies = CorrectMeanAnomalyService(alm.satellites, calculatedValues.meanMotionArr, calculatedValues.tk);
        console.log(calculatedValues);
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
                Na zad
            </Link>
            {/*<ButtonWrapper onClick={calc}>*/}
            {/*    policz ruch średni*/}
            {/*</ButtonWrapper>*/}
            {/*<ButtonWrapper onClick={toWeekNo}>*/}
            {/*    policz czas (tk)*/}
            {/*</ButtonWrapper>*/}
        </PageWrapper>
    )
}

export default LoadFileScreen