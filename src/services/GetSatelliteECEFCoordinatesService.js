import Decimal, {Decimal as Dec} from "decimal.js";

const GetSatelliteECEFCoordinatesService = (almanach) => {

    const satArray = almanach.satellites;
    const e = new Decimal(2.71828182845904523536028747135266249775724709369995);

    //step one

    const dayZero = new Date("01/06/1980 00:00:00"),
            day = new Date(),
            difference = day.getTime() - dayZero.getTime();

    let week;
    week = Math.floor(difference / 1000 / 60 / 60 / 24 / 7);

    let diff2ms;
    diff2ms = difference - week * 1000 * 60 * 60 * 24 * 7;

    week -= 2048;
    const seconds = diff2ms / 1000;
    console.log(week, seconds);

    const tk = week * 604800000 + seconds - almanach.toa;
    console.log(tk);

    //step two vars

    let multiplicand = new Decimal(3.986004415);
    let multiplier = Decimal.pow(10, 14);
    const my = multiplicand.times(multiplier);

    let aCubed;
    let meanMotion;

    //step three vars

    let Mk;

    //step four vars

    const stopCondition = new Decimal(10 * e - 15); //e or eccentricity or 10^-15?

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

    let phik = new Decimal(0);

    //step seven vars

    let rk = new Decimal(0);

    //step eight vars

    let xk, yk;

    /************************************************************************************/

    let temp;

    for (const idx in satArray) {

        const eccentricity = satArray[idx].eccentricity;

        //step two

        aCubed = Decimal.pow(satArray[idx].semimajorAxis, 3);
        temp = Decimal.div(my, aCubed);
        meanMotion = Decimal.sqrt(temp);

        console.log(meanMotion);

        //step three

        temp = Decimal.mul(meanMotion, tk);

        Mk = satArray[idx].meanAnomaly;

        Mk = Decimal.add(Mk, temp);

        console.log(Mk);

        //step four

        let E = Mk;
        let Ei = new Decimal(E.plus(eccentricity * (Decimal.sin(E))));

        while (Decimal.abs(Ei.minus(E)) > stopCondition) {

            E = Ei;
            Ei = new Decimal((Mk.plus(eccentricity * (Dec.sin(E)))));
        }

        console.log(Ei);

        //step five

        eccSquared = Decimal.pow(eccentricity, 2);
        diff = one.minus(eccSquared);
        a = Decimal.sqrt(diff);
        b = Decimal.sin(Ei);
        dividend = Decimal.mul(a, b);
        divider = Decimal.cos(Ei);
        divider.minus(eccentricity);

        vk = Decimal.atan2(dividend, divider);

        console.log(vk);

        //step six

        phik = vk.plus(omega);

        console.log(phik);

        //step seven

        const A = satArray[idx].semimajorAxis;
        temp = eccentricity.times(Decimal.cos(Ei));
        temp = one.minus(temp);
        rk = A.times(temp);

        //step eight

        xk = rk.times(Decimal.cos(phik));
        yk = rk.times(Decimal.sin(phik));

    }


}

export default GetSatelliteECEFCoordinatesService