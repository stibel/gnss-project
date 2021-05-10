import {differenceInMinutes, sub, add} from "date-fns";

const GetElevationChart = async data => {
    const traces = {};

    for(const D of data) {
        for(const s in D.v) {

            if(traces[D.v[s].id] === undefined) {
                traces[D.v[s].id] = {
                    x: [],
                    y: [],
                    type: 'scatter',
                    mode: 'lines',
                    line: { shape: 'spline', smoothing: 0 },
                    name: 'GPS ' + D.v[s].id
                }
            }

            const x = traces[D.v[s].id].x
            const y = traces[D.v[s].id].y
            if(differenceInMinutes(D.t, x[x.length - 1]) > 10) {
                x.push(x[add(x.length - 1, {minutes: 1})])
                y.push(0)
                x.push(null)
                y.push(null)
                x.push(x[sub(D.t, {minutes: 1})])
                y.push(0)
            }

            x.push(D.t);
            y.push(D.v[s].el)
        }
    }

    const tracesArr = []

    Object.keys(traces).forEach((item) => tracesArr.push(traces[item]))

    return tracesArr
}

export default GetElevationChart