import Decimal from "decimal.js";

const degToRad = (degrees) => {

    const degs = new Decimal(degrees);
    const pi = Decimal.acos(-1);
    return degs.times(pi.div(180));
}

const GetTopocentricCoordinatesService = (receiver, satellites) => {

    let X, Y, Z; //receiver coordinates

    let temp;

    const phi = degToRad(52), lambda = degToRad(21), h = new Decimal(100);

    const a = new Decimal(6378137);
    const eSquared = new Decimal(0.00669438002290);


    temp = Decimal.sin(phi);
    temp = Decimal.pow(temp, 2);
    temp = temp.times(eSquared);
    temp = Decimal.sub(1, temp);
    const divider = Decimal.sqrt(temp);


    const N = Decimal.div(a, divider);

    X = (N.add(h)).times(Decimal.cos(phi).times(Decimal.cos(lambda)));
    Y = (N.add(h)).times(Decimal.cos(phi).times(Decimal.sin(lambda)));
    Z = ((N.times(Decimal.sub(1, eSquared))).add(h)).times(Decimal.sin(phi));

    //everything above this is ok

    console.log(X, Y, Z);

}

export default GetTopocentricCoordinatesService