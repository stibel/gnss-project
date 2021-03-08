const CorrectMeanAnomalyService = (satArray, nArr, tk) => {

    if(satArray.length !== nArr.length)
        console.error("satellites array and mean motions array must be the same length", [satArray, nArr]);
    else {
        let mkArr = [];
        for (let i = 0; i < satArray.length; ++i) {
            mkArr.push(satArray[i].meanAnomaly + nArr[i] * tk);
        }

        return mkArr;
    }
}

export default CorrectMeanAnomalyService