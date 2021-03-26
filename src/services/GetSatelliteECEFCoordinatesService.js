import Decimal from "decimal.js";

const degToRad = (degrees) => {

    const degs = new Decimal(degrees);
    const pi = Decimal.acos(-1);
    return (degs.times(pi.div(180))).toNumber();
}

const GetSatelliteECEFCoordinatesService = (almanach) => {

    const satArray = almanach.satellites;

    //step one

    const dayZero = new Date("1980-01-06 00:00:00"),
            day = new Date("2021-03-01 00:00:00"),
            difference = day.getTime() - dayZero.getTime(); //difference between dates in miliseconds

    const msInWeek = 604800000;

    let week;
    week = Math.floor(difference / msInWeek); //full weeks between dayZero and day

    let diff2ms;
    diff2ms = difference - (week * msInWeek); //miliseconds left after substracting full weeks

    week -= 2048;//two full epochs (two times 1024 weeks) passed since dayZero, hardcoded for now

    const seconds = diff2ms / 1000; //seconds left after substracting full weeks

    const t = (week * 604800) + seconds;
    const toa = almanach.toa + ((almanach.gpsWeek - 2048) * 604800);
    const tk = new Decimal(t - toa);

    const my = new Decimal(3.986004415 * Math.pow(10, 14))
    const omega = new Decimal(7.2921151467 * Math.pow(10, -5))

    let satellitesArray = []; //array of satellites to be returned

    for (const idx in satArray) {

        let satellite = {}; //object containing only id and ECEF coordinates

        const sat = satArray[idx];

        //step two

        const a = new Decimal(sat.semimajorAxis);
        // temp = Decimal.div(my, aCubed);
        const meanMotion = Decimal.sqrt(Decimal.div(my, Decimal.pow(a, 3)));

        // console.log(meanMotion);

        //step three

        const Mk = (sat.meanAnomaly + meanMotion * tk) % (2 * Math.PI);
        const mk = new Decimal(Mk);

        //step four

        const eccentricity = new Decimal(sat.eccentricity)
        let E = new Decimal(Mk)
        let Ei = new Decimal(E.plus(eccentricity.mul(Decimal.sin(E))))
        const stopCondition = new Decimal(Math.pow(10, -15))

        while((Ei - E) > stopCondition) {
            E = Ei
            Ei = new Decimal(mk.plus(eccentricity.mul(Decimal.sin(E))))
        }
        //step five

        const vk = Decimal.atan2(Decimal.sqrt(1 - Decimal.pow(eccentricity, 2)).mul(Decimal.sin(Ei)), Decimal.cos(Ei).minus(eccentricity))
        //step six

        const phik = vk.plus(sat.argumentOfPeriapsis);
        //step seven

        const A = new Decimal(sat.semimajorAxis);
        const rk = A.times(1 - eccentricity.times(Decimal.cos(Ei)));
        //step eight

        const xk = rk.times(Decimal.cos(phik));
        const yk = rk.times(Decimal.sin(phik));
        //step nine

        const rateOfRightAscension = new Decimal(sat.rightAscensionDot);
        const rightAscension = new Decimal(sat.rightAscension);

        const bigOmegak = rightAscension.plus(tk.times(rateOfRightAscension.minus(omega))).minus(omega.times(almanach.toa));
        //step ten

        const orbitalInclination = new Decimal(sat.inclination);

        const Xk = xk.times(Decimal.cos(bigOmegak)).minus(yk.times(Decimal.cos(orbitalInclination).times(Decimal.sin(bigOmegak))));
        const Yk = xk.times(Decimal.sin(bigOmegak)).plus(yk.times(Decimal.cos(orbitalInclination)).times(Decimal.cos(bigOmegak)));
        const Zk = yk.times(Decimal.sin(orbitalInclination));

        satellite.id = sat.prn;
        satellite.ECEFcoords = [Xk.toNumber(), Yk.toNumber(), Zk.toNumber()];

        satellitesArray.push(satellite);
    }
    // console.log(satellitesArray);
    return satellitesArray;
}

export default GetSatelliteECEFCoordinatesService;
export {degToRad};