import * as math from 'mathjs'
import {degToRad} from "./GetSatelliteECEFCoordinatesService";
import GetSatelliteECEFCoordinatesService from "./GetSatelliteECEFCoordinatesService";
import GetTopocentricCoordinatesService from "./GetTopocentricCoordinatesService";

const GetDOPService = (receiver, almanach, observationMask = 0) => {

    let satellites = GetSatelliteECEFCoordinatesService(almanach);
    satellites = GetTopocentricCoordinatesService(receiver, satellites, observationMask);

    //receiver coordinates, hardcoded for testing
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

    const X = (N + h) * (Math.cos(phi) * (Math.cos(lambda)));
    const Y = (N + h) * (Math.cos(phi) * (Math.sin(lambda)));
    const Z = (N * (1 -  eSquared) + h) * (Math.sin(phi));

    let deltaPs = [];

    for (const idx in satellites) {

        const s = satellites[idx];
        const xs = s.ECEFcoords[0], ys = s.ECEFcoords[1], zs = s.ECEFcoords[2], ro = s.ro;

        const deltaP = math.matrix([-(xs - X) / ro, -(ys - Y) / ro, -(zs - Z) / ro,  1]);

        deltaPs.push(deltaP);
    }

    const A = math.matrix(deltaPs);

    const AT = math.transpose(A);

    let Q = math.multiply(AT, A);

    Q = math.inv(Q);

    console.log(Q);

    return satellites;
}

export default GetDOPService