import {Decimal as Dec} from "decimal.js";

const GetRealAnomalyService = (eccentricAnomaliesArr) => {

    const e = new Dec(2.71828182845904523536028747135266249775724709369995);
    let realAnArr = [];

    for (const idx in eccentricAnomaliesArr) {
        const Ek = eccentricAnomaliesArr[idx];
        //due to decimal.js inner workings operation needed to be separated into five variables
        const eSquared = Dec.pow(e, 2)
        const a = Dec.sqrt(1 - eSquared);
        const b = Dec.sin(Ek);
        const y = Dec.mul(a, b);
        const x = Dec.cos(Ek);
        x.minus(e);
        console.log(eSquared, b, x);
        console.log(a, y);
        const vk = Dec.atan2(y, x);
        realAnArr.push(vk);
    }

    // console.log(realAnArr);
    return realAnArr;
}

export default GetRealAnomalyService