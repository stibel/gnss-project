import Decimal from "decimal.js"
import math from "math.js"

import {degToRad} from "./GetSatelliteECEFCoordinatesService";

const GetTopocentricCoordinatesService = (receiver, satellite) => {

    let X, Y, Z; //receiver coordinates

    let temp;

    //hardcoded values for testing
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

    console.log(X, Y, Z);

    //everything above this is ok

    const Xs = math.matrix(satellite.ECEFcoords);
    const Xr = math.matrix([X, Y, Z]);
    const Xsr = math.add(Xs, -Xr);

    const RTneu = math.matrix(
        [
            [Decimal.mul(-1, Decimal.mul(Decimal.sin(phi), Decimal.cos(lambda))), Decimal.mul(-1, Decimal.mul(Decimal.sin(phi), Decimal.sin(lambda))), Decimal.cos(phi)],
            [Decimal.mul(-1, Decimal.sin(lambda)), Decimal.cos(lambda), 0],
            [Decimal.mul(Decimal.cos(phi), Decimal.cos(lambda)), Decimal.mul(Decimal.cos(phi), Decimal.cos(lambda)), Decimal.sin(phi)]
        ]
    )

    const Xsrneu = math.multiply(RTneu, Xsr);
}

export default GetTopocentricCoordinatesService