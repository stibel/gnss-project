import React from "react";
import "../styles/binaryClock.css";

const Pip = ({isOn}) =>
    <div className={`pip ${isOn && 'pip--on'}`}></div>

const BinaryDigit = ({base2NumberAsArray}) =>
    <div className="binary-digit">
        {
            base2NumberAsArray.map((pip, idx )=> <Pip key={idx} isOn={pip === 1} />)
        }
    </div>

const BinaryDigitGroup = ({group}) =>
    <div className="binary-digit-group">
        {
            group.map((binaryDigit, idx) => <BinaryDigit base2NumberAsArray={binaryDigit} key={idx} /> )
        }
    </div>

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            digits: [[], [], []]
        }
    }

    componentDidMount() {
        setInterval(function() {
            const date = new Date();
            const newDigits = [
                numberAsBinaryArrayPair(date.getHours()),
                numberAsBinaryArrayPair(date.getMinutes()),
                numberAsBinaryArrayPair(date.getSeconds())
            ];
            this.setState({
                digits: newDigits
            });
        }.bind(this), 1000);
    }

    render() {
        return (
            <div className="app">
                <div className="clock">
                    {
                        this.state.digits.map(digit => <BinaryDigitGroup group={digit} />)
                    }
                </div>
            </div>
        );
    }
}

function numberToBinary(base10Number) {
    const base2Values = [8, 4, 2, 1];
    let output = [0, 0, 0, 0];
    let remainder = base10Number;

    base2Values.forEach((val, idx) => {
        const left = remainder - val;

        if(left >= 0) {
            output[idx] = 1;
            remainder = left
        }
    });

    return output;
}

function numberAsBinaryArrayPair(number) {
    const pair = [];
    if(number < 10) {
        pair[0] = numberToBinary();
        pair[1] = numberToBinary(number);
    } else {
        const numberAsArray = String(number).split('');
        pair[0] = numberToBinary(parseInt(numberAsArray[0], 10));
        pair[1] = numberToBinary(parseInt(numberAsArray[1], 10));
    }

    return pair;
}

export default Clock;