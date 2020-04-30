import axios from "axios";
import MockAxiosAdapter from "@nodefactory/axios-mock-adapter";
import {initBLS, PrivateKey, PublicKey} from "@chainsafe/bls";
import * as fs from "fs";
import * as path from "path";
import {LighthouseValidatorApiClient} from "../../../../../../src/renderer/services/eth2/client/lighthouse/validator";
import {config} from "@chainsafe/lodestar-config/lib/presets/minimal";
import sinon, {SinonStubbedInstance} from "sinon";
import {IBeaconApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {LighthouseBeaconApiClient} from "../../../../../../src/renderer/services/eth2/client/lighthouse/beacon";
import {LighthouseRoutes} from "../../../../../../src/renderer/services/eth2/client/lighthouse/routes";
import {BLSPubkey} from "@chainsafe/lodestar-types";
import {toHexString} from "@chainsafe/ssz";
import { generateEmptyAttestation } from '../../../../../e2e/mocks/attestation';

const httpMock = new MockAxiosAdapter(axios);

describe("lighthouse validator client", function() {

    let client: LighthouseValidatorApiClient;
    let beaconApiStub: SinonStubbedInstance<IBeaconApi>;
    const validator: BLSPubkey = Buffer.from(
        "98f87bc7c8fa10408425bbeeeb3dc387e3e0b4bd92f57775b60b39156a16f9ec80b273a64269332d97bdb7d93ae05a16",
        "hex"
    );
    
    const fakeValidator: BLSPubkey = Buffer.from(
        "42f87bc7c8fa10408425bbeeeb3dc3874242b4bd92f57775b60b39142426f9ec80b273a64269332d97bdb7d93ae05a42",
        "hex"
    );

    beforeAll(async () => {
        await initBLS();
        beaconApiStub = sinon.createStubInstance(LighthouseBeaconApiClient);
        client = new LighthouseValidatorApiClient({
            config,
            baseUrl: ""
        }, beaconApiStub);
    });

    it("get block proposers - has duties", async function() {
        httpMock.onPost(
            LighthouseRoutes.GET_DUTIES,
            {epoch: 0, pubkeys: [toHexString(validator)]}
        ).reply(
            200,
            JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/validator/duties.json"), "utf-8"))
        );
        const proposers = await client.getProposerDuties(0, [validator]);
        expect(proposers.length).toEqual(2);
        expect(config.types.BLSPubkey.equals(validator, proposers[0].proposerPubkey)).toBeTruthy();
        expect(proposers[0].slot).toEqual(1);
        expect(proposers[1].slot).toEqual(3);
    });

    it("get block proposers - no duties", async function() {
        const fakeValidatorPubkey = PrivateKey.fromInt(1).toPublicKey();
        httpMock.onPost(
            LighthouseRoutes.GET_DUTIES,
            {epoch: 0, pubkeys: [fakeValidatorPubkey.toHexString()]}
        ).reply(
            200,
            JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/validator/duties.json"), "utf-8"))
        );
        const proposers = await client.getProposerDuties(
            0, 
            [fakeValidatorPubkey.toBytesCompressed()
            ]);
        expect(proposers.length).toEqual(2);
        expect(
            config.types.BLSPubkey.equals(fakeValidatorPubkey.toBytesCompressed(), proposers[0].proposerPubkey)
        ).toBeFalsy();
        expect(
            config.types.BLSPubkey.equals(fakeValidatorPubkey.toBytesCompressed(), proposers[1].proposerPubkey)
        ).toBeFalsy();
    });


    it("get attestation duties", async function() {
        httpMock.onPost(
            LighthouseRoutes.GET_DUTIES,
            {epoch: 0, pubkeys: [toHexString(validator)]}
        ).reply(
            200,
            JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/validator/duties.json"), "utf-8"))
        );
        const duties = await client.getAttesterDuties(0, [validator]);
        expect(duties).toHaveLength(1);
        expect(duties[0].validatorPubkey).toEqual(validator);
        expect(duties[0].attestationSlot).toEqual(38511);
        expect(duties[0].committeeIndex).toEqual(3);
    });


    it("get attestation duties - no duty", async function() {
        httpMock.onPost(
            LighthouseRoutes.GET_DUTIES,
            {epoch: 0, pubkeys: [toHexString(fakeValidator)]}
        ).reply(
            200,
            JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/validator/duties.json"), "utf-8"))
        );
        const duties = await client.getAttesterDuties(0, [fakeValidator]);
        expect(duties).toHaveLength(0);
    });

    it("get wire attestations", async function() {
        await expect(client.getWireAttestations()).rejects.toThrow();
    });

    it("produce attestation", async function() {
        httpMock.onGet(
            LighthouseRoutes.GET_ATTESTATION,
            {params: {slot: 100, "committee_index": 0}}
        ).reply(
            200,
            JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/validator/attestation.json"), "utf-8"))
        );
        const attestation = await client.produceAttestation(validator, 0, 100);
        expect(attestation).toBeDefined();
    });

    it("produce block", async function() {
        httpMock.onGet(
            LighthouseRoutes.GET_BLOCK,
            {params: {slot: 23, "randao_reveal": "0x00"}}
        ).reply(
            200,
            JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/validator/block.json"), "utf-8"))
        );
        const block = await client.produceBlock(23, validator, Buffer.alloc(1));
        expect(block).toBeDefined();
    });


    it("produce aggregate and proof", async function () {
        httpMock.onGet(
            LighthouseRoutes.GET_AGGREGATED_ATTESTATION
        ).reply(
            200,
            JSON.parse(
                fs.readFileSync(path.join(__dirname, "./payloads/validator/aggregated_attestation.json"), "utf-8")
            )
        );
        // @ts-ignore
        beaconApiStub.getValidator.resolves({index: 5});
        const result = await client.produceAggregateAndProof(generateEmptyAttestation().data, validator);
        expect(result).toBeDefined();
        expect(beaconApiStub.getValidator.calledOnce).toBeTruthy();
        expect(result.aggregatorIndex).toEqual(5);
        expect(result.aggregate.data.slot).toEqual(3);
    });

});