import {networks} from "../../../../../../src/renderer/services/deposit/networks";
import {SupportedNetworks} from "../../../../../../src/renderer/services/docker/chain";
import axios from "axios";
import MockAxiosAdapter from "@nodefactory/axios-mock-adapter";
import {
    PrysmValidatorApiClient,
    PrysmValidatorRoutes
} from "../../../../../../src/renderer/services/eth2/client/prysm/validator";
import {initBLS, PrivateKey} from "@chainsafe/bls";
import {PrysmValidatorDutiesResponse} from "../../../../../../src/renderer/services/eth2/client/prysm/types";
import * as fs from "fs";
import * as path from "path";
import {BeaconBlock, BLSPubkey} from "@chainsafe/eth2.0-types";
import {base64Decode, base64Encode, fromHex} from "../../../../../../src/renderer/services/utils/bytes";
import {
    LighthouseValidatorApiClient,
    LighthouseValidatorRoutes
} from '../../../../../../src/renderer/services/eth2/client/lighthouse/validator';
import { toHexString } from '../../../../../../src/renderer/services/utils/crypto';

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

    // it("propose block flow", async function() {
    //     httpMock.onGet(
    //         PrysmValidatorRoutes.DUTIES,
    //         {params: {epoch: 0, publicKeys: validators.map(base64Encode)}}
    //     ).reply<PrysmValidatorDutiesResponse>(
    //         200,
    //         JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/duties.json"), "utf-8"))
    //     );
    //     httpMock.onGet(
    //         PrysmValidatorRoutes.BLOCK,
    //         {params: {slot: 356216, randaoReveal: base64Encode(Buffer.alloc(32, 1))}}
    //     ).reply<BeaconBlock>(
    //         200,
    //         JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/block.json"), "utf-8"))
    //     );
    //     const duties = await client.getProposerDuties(0);
    //     expect(duties.get(7)).toEqual(PrivateKey.fromInt(0).toPublicKey().toBytesCompressed());
    //     const block = await client.produceBlock(356216, Buffer.alloc(32, 1));
    //     expect(block.slot).toEqual(356216);
    //     expect(block.body.randaoReveal).toEqual(Buffer.alloc(32, 1));
    // });

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

    // it("get wire attestations", async function() {
    //     const attestations = await client.getWireAttestations();
    //     expect(attestations.length).toEqual(0);
    // });


});