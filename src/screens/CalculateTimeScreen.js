import React from "react";
import {Link} from "react-router-dom";

const CalcTimeScreen = (props) => {

    const toWeekNo = () => {
        const dayZero = new Date("01/06/1980 00:00:00");
        const day = new Date();
        const difference = day.getTime() - dayZero.getTime();

        let week = Math.floor(difference / 1000 / 60 / 60 / 24 / 7);
        console.log(week - 2048);
        const diff2ms = difference - week * 1000 * 60 * 60 * 24 * 7;
        week -= 2048;
        const seconds = diff2ms / 1000;
        console.log(week, seconds);
    }

    return (
        <div onClick={toWeekNo}>
            Oblicz do liczby tygodni i sekund
            <br/>
            <Link to={"/"}>wstecz</Link>
        </div>
    )
}

export default CalcTimeScreen