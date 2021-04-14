import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import Chart from "../components/Chart";
import PageWrapper from "../styles/Page";
import GetDOPChart from "../services/GetDOPChart";
import Toast from "../services/SignalService";

const ChartsScreen = props => {

    const history = useHistory()
    const [dopChartData, setDopChartData] = useState(null);

    useEffect(() => {
        if(!props.data) {
            history.push("/Load");
            Toast('Calculate data!', 'e');
            return
        }
        GetDOPChart(props.data).then(res => setDopChartData(res));
        console.log(props.data);
    }, [props.data])

    useEffect(() => {
        console.log(dopChartData)
    }, [dopChartData]);

    return (
        <PageWrapper style={{justifyContent: 'center'}}>
            <Chart data={dopChartData} rootStyle={{marginTop: '5vh'}} ChartTitle={'Wykres współczynników DOP'} XTitle={'Czas'} YTitle={'DOP'} />
        </PageWrapper>
    )
}

export default ChartsScreen;