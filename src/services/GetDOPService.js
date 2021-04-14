import * as math from 'mathjs'
import {degToRad} from "./GetSatelliteECEFCoordinatesService";

const GetDOPService = (satellites, receiver) => {

    console.log(receiver);
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

    const Rneu = math.matrix(
        [
            [-1 * Math.sin(phi) * Math.cos(lambda), -1 * Math.sin(lambda), Math.cos(phi) * Math.cos(lambda)],
            [-1 * Math.sin(phi) * Math.sin(lambda), Math.cos(lambda), Math.cos(phi) * Math.sin(lambda)],
            [Math.cos(phi), 0, Math.sin(phi)]
        ]
    )


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

    // console.log(Q);

    const mainDiag = math.diag(Q);

    const GDOP = Math.sqrt(mainDiag.subset(math.index(0)) + mainDiag.subset(math.index(1)) + mainDiag.subset(math.index(2)) + mainDiag.subset(math.index(3)));

    const PDOP = Math.sqrt(mainDiag.subset(math.index(0)) + mainDiag.subset(math.index(1)) + mainDiag.subset(math.index(2)));

    const TDOP = Math.sqrt(mainDiag.subset(math.index(3)));

    // console.log("G " + GDOP + " P " + PDOP + " T " + TDOP);

    const Qxyz = math.subset(Q, math.index([0, 1, 2], [0, 1, 2]))

    const Qneu = math.multiply(math.transpose(Rneu), Qxyz, Rneu);

    const mainDiagQneu = math.diag(Qneu);

    const HDOP = Math.sqrt(mainDiagQneu.subset(math.index(0)) + mainDiagQneu.subset(math.index(1)));

    const VDOP = Math.sqrt(mainDiagQneu.subset(math.index(2)));

    // console.log("H " + HDOP + " V " + VDOP);

    const PDOPneu = Math.sqrt(mainDiagQneu.subset(math.index(0)) + mainDiagQneu.subset(math.index(1)) + mainDiagQneu.subset(math.index(2)));

    // console.log("P " + PDOP);
    // console.log("Pneu " + PDOPneu);

    return {GDOP, PDOP, TDOP, HDOP, VDOP, PDOPneu};
}

export default GetDOPService