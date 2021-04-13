import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import Toast from "../services/SignalService";


const ChartsScreen = props => {

    const history = useHistory()


    useEffect(() => {
        if(!props.data) {
            history.push('/Load')
            Toast('No data', 'e')
        } else
            console.log(props.data)
    }, [props.data])


    return(
        <div>
            ChartsScreen
        </div>
    )
}

export default ChartsScreen;