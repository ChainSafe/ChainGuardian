import {ICGEth2ValidatorApi} from "../interface";
import {
    Attestation,
    AttestationData,
    AttesterDuty,
    BeaconBlock,
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
import {Json, toHexString} from "@chainsafe/ssz";
import querystring from "querystring";

export class CgEth2ValidatorApi implements ICGEth2ValidatorApi {
    private readonly httpClient: HttpClient;
    private readonly config: IBeaconConfig;
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        this.config = config;
        this.httpClient = httpClient;
    }

    public getAggregatedAttestation = async (attestationDataRoot: Root, slot: Slot): Promise<Attestation> => {
        const query = querystring.stringify({
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            attestation_data_root: this.config.types.Root.toJson(attestationDataRoot) as string,
            slot,
        });
        const url = `/eth/v1/validator/aggregate_attestation?${query}`;
        const responseData = await this.httpClient.get<{data: Json[]}>(url);
        return this.config.types.Attestation.fromJson(responseData.data, {case: "snake"});
    };

    public getAttesterDuties = async (epoch: Epoch, validatorPubKeys: ValidatorIndex[]): Promise<AttesterDuty[]> => {
        const url = `/eth/v1/validator/duties/attester/${epoch.toString()}`;
        const responseData = await this.httpClient.post<string[], {data: Json[]}>(
            url,
            validatorPubKeys.map((index) => this.config.types.ValidatorIndex.toJson(index) as string),
        );
        return responseData.data.map((value) => this.config.types.AttesterDuty.fromJson(value, {case: "snake"}));
    };

    public getProposerDuties = async (epoch: Epoch): Promise<ProposerDuty[]> => {
        const url = `/eth/v1/validator/duties/proposer/${epoch.toString()}`;
        const responseData = await this.httpClient.get<{data: Json[]}>(url);
        return responseData.data.map((value) => this.config.types.ProposerDuty.fromJson(value, {case: "snake"}));
    };

    public prepareBeaconCommitteeSubnet = async (
        validatorIndex: ValidatorIndex,
        committeeIndex: CommitteeIndex,
        committeesAtSlot: number,
        slot: Slot,
        isAggregator: boolean,
    ): Promise<void> => {
        await this.httpClient.post<Json[], void>("/eth/v1/validator/beacon_committee_subscriptions", [
            {
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                validator_index: validatorIndex,
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                committee_index: committeeIndex,
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                committees_at_slot: committeesAtSlot,
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                is_aggregator: isAggregator,
                slot,
            },
        ]);
    };

    public produceAttestationData = async (index: CommitteeIndex, slot: Slot): Promise<AttestationData> => {
        const query = querystring.stringify({
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            committee_index: index,
            slot,
        });
        const responseData = await this.httpClient.get<{data: Json[]}>(`/eth/v1/validator/attestation_data?${query}`);
        return this.config.types.AttestationData.fromJson(responseData.data, {case: "snake"});
    };

    public produceBlock = async (slot: Slot, randaoReveal: Uint8Array, graffiti: string): Promise<BeaconBlock> => {
        const values = {
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            randao_reveal: toHexString(randaoReveal),
            graffiti: graffiti,
        };
        if (!graffiti) delete values.graffiti;
        const query = querystring.stringify(values);
        const responseData = await this.httpClient.get<{data: Json}>(`/eth/v1/validator/blocks/${slot}?${query}`);
        return this.config.types.BeaconBlock.fromJson(responseData.data, {case: "snake"});
    };

    public publishAggregateAndProofs = async (signedAggregateAndProofs: SignedAggregateAndProof[]): Promise<void> => {
        await this.httpClient.post<Json[], void>(
            "/eth/v1/validator/aggregate_and_proofs",
            signedAggregateAndProofs.map((a) => this.config.types.SignedAggregateAndProof.toJson(a, {case: "snake"})),
        );
    };
}
