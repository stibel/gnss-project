import Decimal, {Decimal as Dec} from "decimal.js";

const degToRad = (degrees) => {

    const degs = new Decimal(degrees);
    const pi = Decimal.acos(-1);
    return degs.times(pi.div(180));
}

const GetSatelliteECEFCoordinatesService = (almanach) => {

    const satArray = almanach.satellites;

    const gpsWeek = almanach.gpsWeek - 2048; //substracting full epochs

    //step one

    const dayZero = new Date("January 6, 1980 00:00:00"),
            day = new Date("March 1, 2021 00:00:00"),
            difference = day.getTime() - dayZero.getTime(); //difference between dates in miliseconds

    const msInWeek = 604800000;

    let week;
    week = Math.floor(difference / msInWeek); //full weeks between dayZero and day
    // console.log(week);
    // get amount of weeks between dayZero nad day
    // console.log(week.times(msInWeek));

    let diff2ms;
    diff2ms = difference - (week * msInWeek); //miliseconds left after substracting full weeks
    console.log(diff2ms);

    week -= 2048;//two full epochs (two times 1024 weeks) passed since dayZero, hardcoded for now

    const seconds = diff2ms / 1000; //miliseconds left after substracting full weeks
    console.log(seconds);
    // console.log(week, seconds);

    const t = (week * 604800) + seconds;
    const toa = almanach.toa + (gpsWeek * 604800);
    const tk = new Decimal(t - toa);
    // console.log(tk);

    //step two vars

    let multiplicand = new Decimal(3.986004415);
    let multiplier = Decimal.pow(10, 14);
    const my = multiplicand.times(multiplier);

    let meanMotion;

    //step three vars

    let meanAnomaly
    let Mk;

    //step four vars

    const stopCondition = Decimal.pow(10,-15); //e or eccentricity or 10^-15?

    //step five vars

    let vk;
    const one = new Decimal(1);
    let eccSquared, diff, a, b; //to make calculating dividend easier
    let dividend;
    let divider;

    //step six vars

    multiplicand = new Decimal(7.2921151467);
    multiplier = Decimal.pow(10, -5);
    const omega = multiplicand.times(multiplier);
    console.log("omega: " + omega);

    let phik = new Decimal(0);

    //step seven vars

    let rk = new Decimal(0);

    //step eight vars

    let xk, yk;

    //step nine vars

    let bigOmegak;

    //step ten vars

    let Xk, Yk, Zk;

    /************************************************************************************/

    let satellitesArray = []; //array of satellites

    let temp;

    for (const idx in satArray) {

        let satellite = {}; //object containing only id and ECEF coordinates

        const sat = satArray[idx];

        const eccentricity = new Decimal(sat.eccentricity);

        //step two

        a = new Decimal(sat.semimajorAxis);
        // temp = Decimal.div(my, aCubed);
        meanMotion = Decimal.sqrt(Decimal.div(my, Decimal.pow(a, 3)));

        // console.log(meanMotion);

        //step three

        //temp = Decimal.mul(meanMotion, tk);

        meanAnomaly = new Decimal(sat.meanAnomaly);
        Mk = meanAnomaly.plus(Decimal.mul(meanMotion, tk));
        Mk = Decimal.mod(Mk, 2 * Decimal.acos(-1));

        //step four

        let E = new Decimal(Mk);
        let Ei = new Decimal(E.plus(eccentricity * (Decimal.sin(E))));

        while (Decimal.abs(Ei.minus(E)) > stopCondition) {

            E = Ei;
            Ei = new Decimal((Mk.plus(eccentricity * (Dec.sin(E)))));
        }

        // console.log(Ei);

        //step five

        eccSquared = Decimal.pow(eccentricity, 2);
        diff = one.minus(eccSquared);
        a = Decimal.sqrt(diff);
        b = Decimal.sin(Ei);
        dividend = Decimal.mul(a, b);
        divider = Decimal.cos(Ei);
        divider.minus(eccentricity);

        vk = Decimal.atan2(dividend, divider);

        // console.log(vk);

        //step six

        phik = vk.plus(sat.argumentOfPeriapsis);

        // console.log(phik);

        //step seven

        const A = new Decimal(sat.semimajorAxis);
        temp = eccentricity.times(Decimal.cos(Ei));
        temp = one.minus(temp);
        rk = A.times(temp);

        //step eight

        xk = rk.times(Decimal.cos(phik));
        yk = rk.times(Decimal.sin(phik));

        // console.log(xk, yk);

        //step nine
        const rateOfRightAscension = new Decimal(sat.rightAscensionDot);
        const rightAscension = new Decimal(sat.rightAscension);

        bigOmegak = rightAscension.plus(tk.times(rateOfRightAscension.minus(omega))).minus(omega.times(almanach.toa));

        // console.log(bigOmegak);

        //step ten

        const orbitalInclination = new Decimal(sat.inclination);

        Xk = xk.times(Decimal.cos(bigOmegak)).minus(yk.times(Decimal.cos(orbitalInclination).times(Decimal.sin(bigOmegak))));
        Yk = xk.times(Decimal.sin(bigOmegak)).plus(yk.times(Decimal.cos(orbitalInclination).times(Decimal.cos(bigOmegak))));
        Zk = yk.times(Decimal.sin(orbitalInclination));

        satellite.id = sat.prn;
        satellite.ECEFcoords = ([Xk.toNumber(), Yk.toNumber(), Zk.toNumber()]);

        // console.log(ECEFCoordinates);

        if (satellite.id === 1) {
            console.log("tk: " + tk + " n: " + meanMotion + " Mk:" + Mk + " Ei:" + Ei + " vk:" + vk + " phik:" + phik +
                " rk:" + rk + "small coords: " + xk + ' ' + yk + " bigOmega: " + bigOmegak + " ecef coords: " + Xk + ' '
                + Yk + ' ' + Zk)
        }

        satellitesArray.push(satellite);
    }

    console.log(satellitesArray);
    return satellitesArray;
}

export default GetSatelliteECEFCoordinatesService;
export {degToRad};