const GetVisibleSatsChart = async data => {
    const trace = {
        x: [],
        y: [],
        type: 'scatter',
        mode: 'lines',
        line: { shape: 'spline', smoothing: 1 },
        fill: 'tozeroy',
        name: 'Satellites number'
    }
    for (let D of data) {
        trace.x.push(D.t);
        trace.y.push(D.v.length);
    }

    return [trace];
}

export default GetVisibleSatsChart