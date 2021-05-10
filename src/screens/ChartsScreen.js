import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import Select from "react-select";

import Chart from "../components/Chart";
import PageWrapper from "../styles/Page";
import Toast from "../services/SignalService";
import GetDOPChart from "../services/GetDOPChart";
import GetVisibleSatsChart from "../services/GetVisibleSatsChart";
import GetElevationChart from "../services/GetElevationChart";
import GetSkyplot from "../services/GetSkyplot";
import mainTheme from "../styles/main";
import ButtonRect from "../styles/ButtonRect";

const SelectionWrapper = styled.div`
  width: 100%;
  height: 10vh;
  display: flex;
  align-items: center;
  margin-top: 5%;
  gap: 5%;
  padding-top: 0;
`

const generateHours = () => {
    const options = [];
    for(let i = 0; i < 24; ++i) {
        options.push({label: (i < 10) ? '0' + i : i, value: i})
    }

    return options
}

const generateMinutes = () => {
    const options = []
    for(let i = 0; i < 51; i += 10) {
        options.push({label: (i < 10) ? '0' + i : i, value: i})
    }

    return options
}

const ChartsScreen = props => {

    const history = useHistory()
    const [dopChartData, setDopChartData] = useState(null);
    const [visibleChartData, setVisibleChartData] = useState(null);
    const [elevationChartData, setElevationChartData] = useState(null);
    const [skyplotData, setSkyplotData] = useState(null);
    const [hour, setHour] = useState(12);
    const [minutes, setMinutes] = useState(0);
    const hourOptions = generateHours();
    const minuteOptions = generateMinutes();

    useEffect(() => {
        if(!props.data) {
            history.push('/Load')
            Toast('No data!', 'e')
            return
        }
        GetDOPChart(props.data).then(res => setDopChartData(res));
        GetVisibleSatsChart(props.data).then(res => setVisibleChartData(res));
        GetElevationChart(props.data).then(res => setElevationChartData(res));
        GetSkyplot(props.data, hour, minutes).then(res => setSkyplotData(res));
        // GetGroundTrack(props.data, hour, minutes, props.pos).then(res => setGroundTrackData(res));
    }, [props.data])

    useEffect(() => {
        console.log(dopChartData)
    }, [dopChartData]);

    const changeSkyplot = () => {
        setSkyplotData(null)

        GetSkyplot(props.data, hour, minutes)
            .then(res => {
                console.log(res)
                setSkyplotData(res)
            })
    }

    const customStyles = {
        control: styles => ({
            ...styles,
            backgroundColor: mainTheme.colours.primary,
            height: '5vh',
            width: '5vw',
            fontSize: mainTheme.fonts.size.s,
            border: `solid 3px ${mainTheme.colours.details}`
        }),

        dropdownIndicator: styles => ({
            ...styles,
            color: mainTheme.colours.details
        }),

        menuList: styles => ({
            ...styles,
            backgroundColor: mainTheme.colours.primary,
            border: `solid 3px ${mainTheme.colours.details}`,
            borderRadius: '1%',
            boxShadow: `0 0 25px ${mainTheme.colours.detailsTwo}`
        }),

        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? mainTheme.colours.details : mainTheme.colours.primary,
            color: mainTheme.colours.secondary,
            textDecoration: state.isSelected ? 'underline' : 'none',
            cursor: 'pointer'
        }),

        singleValue: styles => ({
            ...styles,
            color: mainTheme.colours.details
        })
    }

    return (
            <PageWrapper style={{flexFlow: 'column', alignItems: 'center'}}>
                <Chart data={dopChartData} ChartTitle={'Wykres współczynników DOP'} XTitle={'Czas'} YTitle={'DOP'} />
                <Chart data={visibleChartData} ChartTitle={'Wykres widoczności satelitów'} XTitle={'Czas'} YTitle={'Liczba satelitów'} />
                <Chart data={elevationChartData} ChartTitle={'Wykres wysokości satelitów'} XTitle={'Czas'} YTitle={'Liczba satelitów'} />
                <Chart data={skyplotData} plotLayout={{polar: {angularaxis: {rotation: 90, direction: 'clockwise'}}}}
                       style={{marginBottom:'5vh'}} ChartTitle={'Skyplot'} XTitle={'Czas'} YTitle={'Liczba satelitów'}
                       controls={
                           <div style={{display: 'flex', flexFlow: 'column', alignItems: 'flex-start', marginTop: '0'}}>
                               <SelectionWrapper style={{fontSize: mainTheme.fonts.size.m}}>
                                   <div>Godzina</div>
                                   <Select
                                       styles={customStyles}
                                       onChange={(item) => setHour(item.value)}
                                       options={hourOptions}
                                       defaultValue={hourOptions.filter((item) => item.value === 12)[0]}
                                   />
                                   <div>Minuta</div>
                                   <Select
                                       styles={customStyles}
                                       onChange={(item) => setMinutes(item.value)}
                                       options={minuteOptions}
                                       defaultValue={minuteOptions.filter((item) => item.value === 0)[0]}
                                   />
                                   <ButtonRect onClick={changeSkyplot}>Przelicz</ButtonRect>
                               </SelectionWrapper>
                           </div>
                       } />
                <SelectionWrapper />
            </PageWrapper>
    )
}
export default ChartsScreen;