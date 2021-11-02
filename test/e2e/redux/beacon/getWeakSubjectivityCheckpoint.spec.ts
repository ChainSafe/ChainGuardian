/**
 * @jest-environment node
 */

import {testSaga} from "redux-saga-test-plan";
import {WeakSubjectivityCheckpoint} from "../../../../src/renderer/components/ConfigureBeaconNode/ConfigureBeaconNode";
import axios from "axios";
import {
    BeaconScanWSC,
    getWeakSubjectivityCheckpoint,
} from "../../../../src/renderer/ducks/beacon/getWeakSubjectivityCheckpoint";
import {CallEffect} from "@redux-saga/core/effects";
import {CgEth2ApiClient} from "../../../../src/renderer/services/eth2/client/eth2ApiClient";
import {config} from "../../../../src/renderer/services/eth2/config/prater";

const validateWeakSubjectivityCheckpoint = (result: string): void => {
    const [root, epoch] = result.split(":");
    expect(root).toBeDefined();
    expect(epoch).toBeDefined();

    expect(root).toMatch(/^0x[a-fA-F0-9]{64}$/);
};

describe("getWeakSubjectivityCheckpoint", () => {
    const network = "prater";

    it("None", () => {
        testSaga(getWeakSubjectivityCheckpoint, WeakSubjectivityCheckpoint.none, "", network).next().returns("");
    });

    describe("BeaconScan", () => {
        // TODO: reimplement after they fix endpoint
        // it("mainet", async () => {
        //     jest.setTimeout(20000);
        //
        //     const result = await axios.get<BeaconScanWSC>("https://beaconscan.com/ws_checkpoint");
        //     testSaga(getWeakSubjectivityCheckpoint, WeakSubjectivityCheckpoint.beaconScan, "", "mainnet")
        //         .next()
        //         .next(result.data)
        //         .returns(result.data.ws_checkpoint);
        // });

        it("non implemented ws_checkpoint", async () => {
            jest.setTimeout(20000);

            const homeDom = await axios.get(`https://beaconscan.com/${network}`);

            let slotUrl: string;
            const saga = testSaga(getWeakSubjectivityCheckpoint, WeakSubjectivityCheckpoint.beaconScan, "", network)
                .next()
                .next(homeDom.data)
                .inspect((effect: CallEffect) => {
                    expect(effect.payload.args[0]).toBeDefined();
                    slotUrl = effect.payload.args[0];
                });

            const slotDom = await axios.get(`https://beaconscan.com/${slotUrl}`);
            saga.next(slotDom.data).inspect(validateWeakSubjectivityCheckpoint);
        });
    });

    it("Infura", async () => {
        jest.setTimeout(20000);

        const infura =
            "https://1wDQcYYEukhUVgfL4QSgW52I5Qf:cf7444934146776605812bc78292f4d1@eth2-beacon-pyrmont.infura.io";

        const api = new CgEth2ApiClient(config, infura);
        const response = await api.beacon.getWeakSubjectivityCheckpoint();

        testSaga(getWeakSubjectivityCheckpoint, WeakSubjectivityCheckpoint.infura, "", network)
            .next()
            .next(response)
            .inspect(validateWeakSubjectivityCheckpoint);
    });

    it("BeaconChain", async () => {
        jest.setTimeout(20000);

        // eslint-disable-next-line camelcase
        const indexData = await axios.get<{current_finalized_epoch: number}>(
            `https://${network}.beaconcha.in/index/data`,
        );
        const dom = await axios.get(`https://${network}.beaconcha.in/epoch/${indexData.data.current_finalized_epoch}`);

        testSaga(getWeakSubjectivityCheckpoint, WeakSubjectivityCheckpoint.beaconChain, "", network)
            .next()
            .next(indexData.data)
            .next(dom.data)
            .inspect(validateWeakSubjectivityCheckpoint);
    });

    it("Custom", () => {
        const meta = "0xbbe050164615168481d4c39e4d0b5a16a908abc86012e2277c162382919e1b5b:66127";
        testSaga(getWeakSubjectivityCheckpoint, WeakSubjectivityCheckpoint.custom, meta, network).next().returns(meta);
    });
});
