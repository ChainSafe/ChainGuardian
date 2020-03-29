import {networks} from "../../../../../../src/renderer/services/deposit/networks";
import {SupportedNetworks} from "../../../../../../src/renderer/services/docker/chain";
import axios from "axios";
import MockAxiosAdapter from "@nodefactory/axios-mock-adapter";
import {initBLS} from "@chainsafe/bls";
import * as fs from "fs";
import * as path from "path";
import {BLSPubkey} from "@chainsafe/eth2.0-types";
import {fromHex} from "../../../../../../src/renderer/services/utils/bytes";
import {
    LighthouseValidatorApiClient,
    LighthouseValidatorRoutes
} from "../../../../../../src/renderer/services/eth2/client/lighthouse/validator";
import {toHexString} from "../../../../../../src/renderer/services/utils/crypto";

const httpMock = new MockAxiosAdapter(axios);

describe("lighthouse validator client", function() {

    let client: LighthouseValidatorApiClient;
    let validators: BLSPubkey[];

    beforeAll(async () => {
        await initBLS();
        validators = [
            // eslint-disable-next-line max-len
            fromHex("0x98f87bc7c8fa10408425bbeeeb3dc387e3e0b4bd92f57775b60b39156a16f9ec80b273a64269332d97bdb7d93ae05a16"),
            // eslint-disable-next-line max-len
            fromHex("0x42f87bc7c8fa10408425bbeeeb3dc3874242b4bd92f57775b60b39142426f9ec80b273a64269332d97bdb7d93ae05a42")
        ];
        client = new LighthouseValidatorApiClient({
            config: networks.find((network) => network.networkName === SupportedNetworks.PRYSM)!.eth2Config,
            urlPrefix: ""
        },
        validators
        );
    });

    it("get block proposers", async function() {
        httpMock.onPost(
            LighthouseValidatorRoutes.DUTIES,
            {epoch: 0, pubkeys: validators.map(toHexString)}
        ).reply(
            200,
            JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/duties.json"), "utf-8"))
        );
        const proposers = await client.getProposerDuties(0);
        expect(proposers.size).toEqual(3);
        expect(proposers.get(1)).toEqual(validators[0]);
        expect(proposers.get(5)).toEqual(validators[0]);
        expect(proposers.get(2)).toEqual(validators[1]);
    });

    it("get attestation duties", async function() {
        httpMock.onPost(
            LighthouseValidatorRoutes.DUTIES,
            {epoch: 0, pubkeys: [toHexString(validators[0])]}
        ).reply(
            200,
            JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/duties.json"), "utf-8"))
        );
        const duties = await client.getAttesterDuties(0, [validators[0]]);
        expect(duties).toHaveLength(1);
        expect(duties[0].validatorPubkey).toEqual(validators[0]);
        expect(duties[0].attestationSlot).toEqual(38511);
        expect(duties[0].committeeIndex).toEqual(3);
    });

    it("get wire attestations", async function() {
        const attestations = await client.getWireAttestations();
        expect(attestations.length).toEqual(0);
    });

    it("is aggregator", async function() {
        const isAggregator = await client.isAggregator();
        expect(isAggregator).toBeFalsy();
    });

    it("produce attestation", async function() {
        httpMock.onGet(
            LighthouseValidatorRoutes.ATTESTATION,
            {params: {slot: 100, "committee_index": 0}}
        ).reply(
            200,
            JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/attestation.json"), "utf-8"))
        );
        const attestation = await client.produceAttestation(validators[0], false, 0, 100);
        expect(attestation).toBeDefined();
    });

    it("produce block", async function() {
        httpMock.onGet(
            LighthouseValidatorRoutes.BLOCK,
            {params: {slot: 23, "randao_reveal": "0x00"}}
        ).reply(
            200,
            JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/block.json"), "utf-8"))
        );
        const block = await client.produceBlock(23, Buffer.alloc(1));
        expect(block).toBeDefined();
    });


});