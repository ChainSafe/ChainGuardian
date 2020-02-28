import {networks} from "../../../../../src/renderer/services/deposit/networks";
import {SupportedNetworks} from "../../../../../src/renderer/services/docker/chain";
import axios from "axios";
import MockAxiosAdapter from "@nodefactory/axios-mock-adapter";
import {
    PrysmValidatorApiClient,
    PrysmValidatorRoutes
} from "../../../../../src/renderer/services/eth2/client/prysm/validator";
import {initBLS, PrivateKey} from "@chainsafe/bls";
import {
    PrysmValidatorDutiesResponse,
    PrysmValidatorStatus
} from "../../../../../src/renderer/services/eth2/client/prysm/types";
import {base64Encode} from "../../../../../src/renderer/services/utils/bytes";

const httpMock = new MockAxiosAdapter(axios);

describe("prysm validator client", function() {

    const client = new PrysmValidatorApiClient({
        config: networks.find((network) => network.networkName === SupportedNetworks.PRYSM)!.eth2Config,
        urlPrefix: ""
    });

    beforeAll(async () => {
        await initBLS();
    });

    it("get attester duties", async function() {
        const validators = [
            PrivateKey.random().toPublicKey().toBytesCompressed(),
            PrivateKey.random().toPublicKey().toBytesCompressed()
        ];
        httpMock.onGet(PrysmValidatorRoutes.DUTIES).reply<PrysmValidatorDutiesResponse>(200, {
            duties: [
                {
                    attesterSlot: "2",
                    committeeIndex: "3",
                    committee: [],
                    publicKey: base64Encode(validators[0]),
                    proposerSlot: "7",
                    status: PrysmValidatorStatus.ACTIVE,
                    validatorIndex: "9"
                },
                {
                    attesterSlot: "4",
                    committeeIndex: "3",
                    committee: [],
                    publicKey: base64Encode(PrivateKey.random().toPublicKey().toBytesCompressed()),
                    proposerSlot: "8",
                    status: PrysmValidatorStatus.ACTIVE,
                    validatorIndex: "12"
                },
                {
                    attesterSlot: "",
                    committeeIndex: "3",
                    committee: [],
                    publicKey: base64Encode(validators[1]),
                    proposerSlot: "8",
                    status: PrysmValidatorStatus.ACTIVE,
                    validatorIndex: "12"
                },
            ]
        });
        const duties = await client.getAttesterDuties(0, validators);
        expect(duties.length).toEqual(1);
        expect(duties[0].committeeIndex).toEqual(3);
        expect(duties[0].attestationSlot).toEqual(2);
        expect(duties[0].validatorPubkey).toEqual(validators[0]);
    });

    it("get proposer duties", async function() {
        const validators = [
            PrivateKey.random().toPublicKey().toBytesCompressed(),
            PrivateKey.random().toPublicKey().toBytesCompressed()
        ];
        httpMock.onGet(PrysmValidatorRoutes.DUTIES).reply<PrysmValidatorDutiesResponse>(200, {
            duties: [
                {
                    attesterSlot: "2",
                    committeeIndex: "3",
                    committee: [],
                    publicKey: base64Encode(validators[0]),
                    proposerSlot: "7",
                    status: PrysmValidatorStatus.ACTIVE,
                    validatorIndex: "9"
                },
                {
                    attesterSlot: "4",
                    committeeIndex: "3",
                    committee: [],
                    publicKey: base64Encode(PrivateKey.random().toPublicKey().toBytesCompressed()),
                    proposerSlot: "",
                    status: PrysmValidatorStatus.ACTIVE,
                    validatorIndex: "12"
                },
            ]
        });
        client.trackValidator(validators[0]);
        client.trackValidator(validators[1]);
        const duties = await client.getProposerDuties(0);
        expect(duties.get(7)).toEqual(validators[0]);
    });

    it("get attester duties", async function() {
        const attestations = await client.getWireAttestations();
        expect(attestations.length).toEqual(0);
    });

    it("is aggregator", async function() {
        expect(await client.isAggregator()).toBeFalsy();
    });

});