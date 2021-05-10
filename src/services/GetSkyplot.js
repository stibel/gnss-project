import {differenceInMinutes, format} from "date-fns";

const GetSkyplot = async (data, hour, minutes) => {

    console.log("HOUR", hour, "MIN", minutes)

    const traces = {}
    const pointTraces = {}
    const times = {}

    for(let D of data) {
        for(let s in D.v) {
            if(traces[D.v[s].id] === undefined) {
                traces[D.v[s].id] = {
                    theta: [],
                    r: [],
                    type: 'scatterpolar',
                    mode: 'lines',
                    line: {shape: 'spline', smoothing: 1},
                    name: 'GPS ' + D.v[s].id,
                    hovertext: [], opacity: 0.2
                }
            }

            if(pointTraces[D.v[s].id] === undefined) {
                pointTraces[D.v[s].id] = {
                    theta: [],
                    r: [],
                    type: 'scatterpolar',
                    mode: 'markers+text',
                    text: [],
                    textposition: 'bottom',
                    marker: {size: 10},
                    name: 'GPS ' + D.v[s].id,
                    hovertext: []
                }
            }

            if(times[D.v[s].id] === undefined)
                times[D.v[s].id] = []


            const timesArr = times[D.v[s].id];


            if(timesArr.length > 1 && differenceInMinutes(D.t, timesArr[timesArr.length - 1]) > 10) {
                traces[D.v[s].id].theta.push(null);
                traces[D.v[s].id].r.push(null);
                traces[D.v[s].id].r.push(null);
            }

            timesArr.push(D.t)

            const date = new Date(D.t)
            const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minutes, 0)

            if(differenceInMinutes(date, compareDate) === 0) {
                pointTraces[D.v[s].id].theta.push(D.v[s].Az);
                pointTraces[D.v[s].id].text.push('GPS ' + D.v[s].id);
                pointTraces[D.v[s].id].r.push(90 - D.v[s].el)
                pointTraces[D.v[s].id].hovertext.push(
                    ['Time: ' + format(D.t, 'hh:mm dd/MM/yyyy')
                        , 'Azimuth: ' + Math.floor(
                        D.v[s].Az * 100) / 100, 'Elevation: ' + Math.floor(
                        D.v[s].el * 100) / 100])
            }

            traces[D.v[s].id].theta.push(D.v[s].Az);
            traces[D.v[s].id].r.push(90 - D.v[s].el)
            traces[D.v[s].id].hovertext.push(['Time: ' + format(D.t, 'hh:mm dd/MM/yyyy')
                , 'Azimuth: ' + Math.floor(
                    D.v[s].Az * 100) / 100, 'Elevation: ' + Math.floor(
                    D.v[s].el * 100) / 100])
        }
    }

    const tracesArr = []

    Object.keys(traces).forEach((item) => tracesArr.push(traces[item]))
    Object.keys(pointTraces).forEach((item) => tracesArr.push(pointTraces[item]))

    return tracesArr

}

export default GetSkyplot