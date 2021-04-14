import React from "react";
import Plotly from "plotly.js";
import createPlotlyComponent from "react-plotly.js/factory";

import mainTheme from "../styles/main";

const Plot = createPlotlyComponent(Plotly);

const plot = (xTitle, yTitle, plotTitle, rangeX = [], rangeY = [], titleFactor = 2, axisTitleFactor = 1) => {
    return {
        xaxis: {
            title: {
                text: xTitle,
                font: {
                    color: mainTheme.colours.secondary,
                    size: (window.innerHeight > window.innerWidth) ? window.innerHeight / 100 * axisTitleFactor : window.innerWidth / 100 * axisTitleFactor
                },
                standoff: 25
            },
            gridcolor: mainTheme.colours.details,
            color: mainTheme.colours.detailsTwo,
            range: rangeX
        },
        yaxis: {
            title: {
                text: yTitle,
                font: {
                    color: mainTheme.colours.secondary,
                    size: (window.innerHeight > window.innerWidth) ? window.innerHeight / 100 * axisTitleFactor : window.innerWidth / 100 * axisTitleFactor
                },
                standoff: 25
            },
            gridcolor: mainTheme.colours.details,
            color: mainTheme.colours.detailsTwo,
            range: rangeY
        },
        title: {
            text: plotTitle,
            font: {
                size: (window.innerHeight > window.innerWidth) ? window.innerHeight / 100 * titleFactor : window.innerWidth / 100 * titleFactor,
                color: mainTheme.colours.secondary
            },
            x: 0.1
        },
        legend: {
            font: {
                color: mainTheme.colours.secondary
            }
        },
        margin: {
            pad: 10
        },
        marker: {
            line: {
                smoothing: 0
            }
        },
        autosize: true,
        plot_bgcolor: mainTheme.colours.primary,
        paper_bgcolor: mainTheme.colours.primary,
        boxShadow: '0 0 50px ' + mainTheme.colours.detailsTwo
    }
}

const Chart = props => {
    return (
        <div style={{width: '80%', display: 'flex', flexFlow: 'column', justifyContent: 'center'}}>
            <Plot data={props.data}
                  style={{width: '95%', height: '100%'}}
                  useResizeHandler={true}
                  layout={{...plot(props.XTitle, props.YTitle, props.ChartTitle, props.rangeX, props.rangeY,
                          props.titleFactor, props.AxisFactor)}}
                  config={{scrollZoom: false, displaylogo: false, ...props.plotCongif}}
                  />
        </div>
    )
}

export default Chart;