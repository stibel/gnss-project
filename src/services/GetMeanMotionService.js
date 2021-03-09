const GetMeanMotionService = (satArray) => {

    const constantValue = 3.986004415 * Math.pow(10, 14);
    let aCubed;
    let nArr = [];
    for (const idx in satArray) {
        aCubed = Math.pow(satArray[idx].semimajorAxis, 3);
        nArr.push(Math.sqrt(constantValue / aCubed));
    }
    //console.log(nArr);
    return nArr;
}

export default GetMeanMotionService