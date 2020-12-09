import {ICGEth2ValidatorApi} from "../interface";
import {
    Attestation,
    AttestationData,
    AttesterDuty,
    BeaconBlock,
    BLSPubkey,
    CommitteeIndex,
    Epoch,
    ProposerDuty,
    Root,
    SignedAggregateAndProof,
    Slot,
    ValidatorIndex,
} from "@chainsafe/lodestar-types";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";

export class Validator implements ICGEth2ValidatorApi {
    private readonly httpClient: HttpClient;
    private readonly config: IBeaconConfig;
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        this.config = config;
        this.httpClient = httpClient;
    }

    public getAggregatedAttestation = async (attestationDataRoot: Root, slot: Slot): Promise<Attestation> => {
        console.log("getAggregatedAttestation", attestationDataRoot, slot);
        return undefined as Attestation;
    };

    public getAttesterDuties = async (epoch: Epoch, validatorPubKeys: ValidatorIndex[]): Promise<AttesterDuty[]> => {
        console.log("getAttesterDuties", epoch, validatorPubKeys);
        return undefined as AttesterDuty[];
    };

    public getProposerDuties = async (epoch: Epoch, validatorPubKeys: BLSPubkey[]): Promise<ProposerDuty[]> => {
        console.log("getProposerDuties", epoch, validatorPubKeys);
        return undefined as ProposerDuty[];
    };

    public prepareBeaconCommitteeSubnet = async (
        validatorIndex: ValidatorIndex,
        committeeIndex: CommitteeIndex,
        committeesAtSlot: number,
        slot: Slot,
        isAggregator: boolean,
    ): Promise<void> => {
        console.log(
            "prepareBeaconCommitteeSubnet",
            validatorIndex,
            committeeIndex,
            committeesAtSlot,
            slot,
            isAggregator,
        );
    };

    public produceAttestationData = async (index: CommitteeIndex, slot: Slot): Promise<AttestationData> => {
        console.log("produceAttestationData", index, slot);
        return undefined as AttestationData;
    };

    public produceBlock = async (slot: Slot, randaoReveal: Uint8Array, graffiti: string): Promise<BeaconBlock> => {
        console.log("produceBlock", slot, randaoReveal, graffiti);
        return undefined as BeaconBlock;
    };

    public publishAggregateAndProofs = async (signedAggregateAndProofs: SignedAggregateAndProof[]): Promise<void> => {
        console.log("publishAggregateAndProofs", signedAggregateAndProofs);
    };
}
