import * as math from 'mathjs';

import {degToRad} from "./GetSatelliteECEFCoordinatesService";

const GetTopocentricCoordinatesService = (receiver, satellites) => {

    let X, Y, Z; //receiver coordinates

    //hardcoded values for testing
    const phi = degToRad(52), lambda = degToRad(21), h = 100;

    const a = 6378137;
    const eSquared = 0.00669438002290;

    let temp;
    temp = Math.sin(phi);
    temp = Math.pow(temp, 2);
    temp *= eSquared;
    temp = 1 - temp;
    const divider = Math.sqrt(temp);


    const N = a / divider;

    X = (N + h) * (Math.cos(phi) * (Math.cos(lambda)));
    Y = (N + h) * (Math.cos(phi) * (Math.sin(lambda)));
    Z = (N * (1 -  eSquared) + h) * (Math.sin(phi));

    console.log(X, Y, Z);

    //everything above this is ok

    let satellitesArray = [];

    for (const idx in satellites) {

        let s = satellites[idx];

        const Xs = math.matrix(s.ECEFcoords);
        const Xr = math.matrix([X, Y, Z]);
        math.multiply(-1, Xr)
        const Xsr = math.add(Xs, Xr);
        // console.log(Xs, Xr, Xsr);

        const RTneu = math.matrix(
            [
                [-1 * Math.sin(phi) * Math.cos(lambda), -1 * Math.sin(lambda), Math.cos(phi) * Math.cos(lambda)],
                [-1 * Math.sin(phi) * Math.sin(lambda), Math.cos(lambda), Math.cos(phi) * Math.cos(lambda)],
                [Math.cos(phi), 0, Math.sin(phi)]
            ]
        )

        const Xsrneu = math.multiply(RTneu, Xsr);

        // console.log(RTneu, Xsrneu)

        // Xsrneu.forEach(function (value, index, matrix) {
        //     console.log('value:', value, 'index:', index)
        // })

        const n = Xsrneu.subset(math.index(0));
        const e = Xsrneu.subset(math.index(1));
        const u = Xsrneu.subset(math.index(2));

        s.Az = math.atan(e / n);
        s.el = math.asin(u / math.sqrt(math.pow(n, 2) + math.pow(e, 2) + math.pow(u, 2)));

        satellitesArray.push(s);
    }

    return satellitesArray;
}

export default GetTopocentricCoordinatesService