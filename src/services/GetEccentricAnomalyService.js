import {Decimal as Dec} from "decimal.js";

const GetEccentricAnomalyService = (satArray, correctedAnomaliesArr) => {

    const e = new Dec(2.71828182845904523536028747135266249775724709369995);
    const difference = new Dec(10 * e - 15);
    let eccAnArr = [];

    for (const idx in correctedAnomaliesArr) {

        const mk = new Dec(correctedAnomaliesArr[idx]);
        let E = new Dec(mk);
        let E2 = new Dec(E.plus((satArray[idx].eccentricity) * (Dec.sin(E))));

        while (Dec.abs(E2 - E) > difference) {
            E = E2;
            E2 = new Dec(mk.plus((satArray[idx].eccentricity) * (Dec.sin(E))));
        }

        eccAnArr.push(E2);
    }

    return eccAnArr;
}

export default GetEccentricAnomalyService