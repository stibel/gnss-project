const GetEccentricAnomaly = (correctedAnomaliesArr) => {

    let EArr = [];

    function getEccAn(item) {
        const e = 2.71828182845904523536028747135266249775724709369995;
        let Ei = item + e*Math.sin(item);
        let Eii = item + e*Math.sin(Ei);

        while Math.abs(Eii - Ei) > Math.pow(10, -15) {
            Eii = item + e*Math.sin(Ei);
        }
        return Eii;
    }

    correctedAnomaliesArr.forEach(getEccAn)
}

export default GetEccentricAnomaly