import {networks} from "../../../../../src/renderer/services/eth2/networks";
import {SupportedNetworks} from "../../../../../src/renderer/services/docker/chain";
import axios from "axios";
import MockAxiosAdapter from "@nodefactory/axios-mock-adapter";
import {
    PrysmValidatorApiClient,
    PrysmValidatorRoutes
} from "../../../../../src/renderer/services/eth2/client/prysm/validator";
import {initBLS, PrivateKey} from "@chainsafe/bls";
import {PrysmValidatorDutiesResponse} from "../../../../../src/renderer/services/eth2/client/prysm/types";
import * as fs from "fs";
import * as path from "path";
import {BeaconBlock, BLSPubkey} from "@chainsafe/eth2.0-types";
import {base64Decode, base64Encode} from "../../../../../src/renderer/services/utils/bytes";

const httpMock = new MockAxiosAdapter(axios);

describe("prysm validator client", function() {

    let client: PrysmValidatorApiClient;
    let validators: BLSPubkey[];

    beforeAll(async () => {
        await initBLS();
        validators = [
            PrivateKey.fromInt(0).toPublicKey().toBytesCompressed(),
            PrivateKey.fromInt(1).toPublicKey().toBytesCompressed()
        ];
        client = new PrysmValidatorApiClient({
            config: networks.find((network) => network.networkName === SupportedNetworks.PRYSM)!.eth2Config,
            urlPrefix: ""
        },
        validators
        );
    });

    it("propose block flow", async function() {
        httpMock.onGet(
            PrysmValidatorRoutes.DUTIES, 
            {params: {epoch: 0, publicKeys: validators.map(base64Encode)}}
        ).reply<PrysmValidatorDutiesResponse>(
            200,
            JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/duties.json"), "utf-8"))
        );
        httpMock.onGet(
            PrysmValidatorRoutes.BLOCK,
            {params: {slot: 356216, randaoReveal: base64Encode(Buffer.alloc(32, 1))}}
        ).reply<BeaconBlock>(
            200,
            JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/block.json"), "utf-8"))
        );
        const duties = await client.getProposerDuties(0);
        expect(duties.get(7)).toEqual(PrivateKey.fromInt(0).toPublicKey().toBytesCompressed());
        const block = await client.produceBlock(356216, Buffer.alloc(32, 1));
        expect(block.slot).toEqual(356216);
        expect(block.body.randaoReveal).toEqual(Buffer.alloc(32, 1));
    });

    it("propose attestation flow", async function() {
        httpMock.onGet(
            PrysmValidatorRoutes.DUTIES,
            {params: {epoch: 0, publicKeys: [base64Encode(validators[0])]}}
        ).reply(
            200,
            JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/duties.json"), "utf-8"))
        );
        httpMock.onGet(
            PrysmValidatorRoutes.ATTESTATION,
            {params: {slot: 356216, committeeIndex: 3}}
        ).reply(
            200,
            JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/attestationData.json"), "utf-8"))
        );
        httpMock.onGet(
            PrysmValidatorRoutes.VALIDATOR_INDEX,
            {params: {publicKey: base64Encode(validators[0])}}
        ).reply(
            200,
            {index: "9"}
        );
        httpMock.onPost(
            PrysmValidatorRoutes.AGGREGATE_ATTESTATIONS,
            {
                slot: 356216,
                committeeIndex: 3,
                publicKey: base64Encode(validators[0]),
                slotSignature: base64Encode(Buffer.alloc(32, 1))
            }
        ).reply(
            200
        );
        const duties = await client.getAttesterDuties(0, [validators[0]]);
        expect(duties.length).toEqual(1);
        const attestationDuty = duties[0];
        expect(attestationDuty.attestationSlot).toEqual(356216);
        expect(attestationDuty.committeeIndex).toEqual(3);
        const isAggregator = await client.isAggregator(356216, 3, Buffer.alloc(32, 1));
        //as long as committee size is less than target, it will always be aggregator
        expect(isAggregator).toBeTruthy();
        const attestation = await client.produceAttestation(validators[0], false, 3, 356216);
        expect(attestation.aggregationBits.getBit(3)).toBeTruthy();
        expect(attestation.data.beaconBlockRoot).toEqual(base64Decode("YH+mmjrZqLK/4njgi8ANNftJ8cR79OvgEtoy23FBIlg="));
        await client.publishAggregatedAttestation(attestation, validators[0], Buffer.alloc(32, 1));
        expect(httpMock.history.post.length).toEqual(1);
    });

    it("get wire attestations", async function() {
        const attestations = await client.getWireAttestations();
        expect(attestations.length).toEqual(0);
    });


});