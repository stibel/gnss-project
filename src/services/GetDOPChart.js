const GetDOPChart = async data => {
    const traces = {}

    for (let D of data) {
        for (let dop of Object.keys(D.d)) {
            if(traces[dop] === undefined) {
                traces[dop] = {
                    x: [],
                    y: [],
                    type: 'scatter',
                    mode: 'lines',
                    line: { shape: 'spline', smoothing: 1 },
                    name: dop,
                    stackgroup: 'one'
                }
            }

            traces[dop].x.push(D.t);
            traces[dop].y.push(D.d[dop]);
        }
    }

    const tracesArr = [];

    Object.keys(traces).forEach((item) => tracesArr.push(traces[item]));

    return tracesArr;
}

export default GetDOPChart;