const GetTimeService = (toa) => {


    const dayZero = new Date("01/06/1980 00:00:00");
    const day = new Date();
    const difference = day.getTime() - dayZero.getTime();

    let week = Math.floor(difference / 1000 / 60 / 60 / 24 / 7);

    let diff2ms;
    diff2ms = difference - week * 1000 * 60 * 60 * 24 * 7;

    week -= 2048;
    const seconds = diff2ms / 1000;
    console.log(week, seconds);

    const tk = week * 604800000 + seconds - toa;
    console.log(tk);

    return tk;
};

export default GetTimeService;