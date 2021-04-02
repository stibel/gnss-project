import * as math from 'mathjs';

import GetSatelliteECEFCoordinatesService from "./GetSatelliteECEFCoordinatesService";
import {degToRad} from "./GetSatelliteECEFCoordinatesService";

const GetTopocentricCoordinatesService = (receiver, almanach, observationMask = 0) => {

    const satellites = GetSatelliteECEFCoordinatesService(almanach);

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

    // console.log(X, Y, Z);

    //everything above this is ok

    let satellitesArray = [];

    const Rneu = math.matrix(
        [
            [-1 * Math.sin(phi) * Math.cos(lambda), -1 * Math.sin(lambda), Math.cos(phi) * Math.cos(lambda)],
            [-1 * Math.sin(phi) * Math.sin(lambda), Math.cos(lambda), Math.cos(phi) * Math.sin(lambda)],
            [Math.cos(phi), 0, Math.sin(phi)]
        ]
    )

    for (const s of satellites) {

        const Xsr = [s.ECEFcoords[0] - X, s.ECEFcoords[1] - Y, s.ECEFcoords[2] - Z];

        const Xsrneu = math.multiply(math.transpose(Rneu), Xsr);

        const n = Xsrneu.subset(math.index(0));
        const e = Xsrneu.subset(math.index(1));
        const u = Xsrneu.subset(math.index(2));

        s.neu = [n, e, u];
        s.Az = Math.atan2(e, n) * 180 / Math.PI;
        if (s.Az < 0)
            s.Az += 360;
        s.el = Math.asin(u / Math.sqrt(Math.pow(n, 2) + Math.pow(e, 2) + Math.pow(u, 2))) * 180 / Math.PI;
        s.ro = math.norm(Xsr);

        if (s.el > observationMask)
            satellitesArray.push(s);
    }

    return satellitesArray;
}

export default GetTopocentricCoordinatesService