import {CgEth2ValidatorApi} from "../eth2ApiClient/cgEth2ValidatorApi";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {HttpClient} from "../../../api";
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
import {Json, toHexString} from "@chainsafe/ssz";
import {base64ToHex, hexToBase64} from "./utils";
import {
    DutiesResponse,
    ValidatorStatusResponse,
    Assignments,
    BeaconBlock as PrysmBeaconBlock,
    AttestationData as PrysmAttestationData,
} from "./types";
import querystring from "querystring";
import {
    mapAttestationData,
    mapProduceBlockResponseToStandardProduceBlock,
} from "./mapProduceBlockResponseToStandardProduceBlock";

export class CgPrysmEth2ValidatorApi extends CgEth2ValidatorApi {
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        super(config, httpClient);
    }

    public getAttesterDuties = async (epoch: Epoch, validatorIndexes: ValidatorIndex[]): Promise<AttesterDuty[]> => {
        const pubkeyQuery = (
            await Promise.all(
                validatorIndexes.map((index) =>
                    this.httpClient.get<ValidatorStatusResponse>(`/eth/v1alpha1/validator?index=${index}`),
                ),
            )
        )
            .map(({public_key: pubkey}) => `&public_keys=${encodeURIComponent(pubkey)}`)
            .join("");
        const duties = await this.httpClient.get<DutiesResponse>(
            `/eth/v1alpha1/validator/duties?epoch=${Number(epoch.toString()) - 1}${pubkeyQuery}`,
        );
        const transformed: Json[] = [];
        for (const duty of duties.next_epoch_duties) {
            transformed.push({
                pubkey: base64ToHex(duty.public_key),
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                validator_index: duty.validator_index,
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                committee_index: duty.committee_index,
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                committee_length: duty.committee.length,
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                committees_at_slot: duty.committee.findIndex((validator) => validator === duty.validator_index) + 1,
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                validator_committee_index: duty.committee_index,
                slot: duty.attester_slot,
            });
        }
        return transformed.map((value) => this.config.types.AttesterDuty.fromJson(value, {case: "snake"}));
    };

    public getProposerDuties = async (epoch: Epoch): Promise<ProposerDuty[]> => {
        const url = `/eth/v1alpha1/validators/assignments?epoch=${epoch.toString()}`;
        const responseData = await this.httpClient.get<Assignments>(url);
        const transformed: Json[] = [];
        for (const assignment of responseData.assignments) {
            for (const slot of assignment.proposer_slots) {
                transformed.push({
                    pubkey: base64ToHex(assignment.public_key),
                    // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                    validator_index: assignment.validator_index,
                    slot: slot,
                });
            }
        }
        return transformed.map((value) => this.config.types.ProposerDuty.fromJson(value, {case: "snake"}));
    };

    public prepareBeaconCommitteeSubnet = async (
        validatorIndex: ValidatorIndex,
        committeeIndex: CommitteeIndex,
        committeesAtSlot: number,
        slot: Slot,
        isAggregator: boolean,
    ): Promise<void> => {
        await this.httpClient.post<Json, void>("/eth/v1alpha1/validator/subnet/subscribe", {
            slots: [slot],
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            committee_ids: [committeesAtSlot],
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            is_aggregator: [isAggregator],
        });
    };

    public produceBlock = async (slot: Slot, randaoReveal: Uint8Array, graffiti: string): Promise<BeaconBlock> => {
        const values = {
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            randao_reveal: hexToBase64(toHexString(randaoReveal)),
            graffiti: hexToBase64(
                graffiti.startsWith("0x")
                    ? graffiti
                    : "0x" + Buffer.from(graffiti, "utf-8").toString("hex").padEnd(64, "0"),
            ),
            slot: slot.toString(),
        };
        if (!graffiti) delete values.graffiti;
        const query = querystring.stringify(values);
        const responseData = await this.httpClient.get<PrysmBeaconBlock>(`/eth/v1alpha1/validator/block?${query}`);
        const transformedResponseData = mapProduceBlockResponseToStandardProduceBlock(responseData);
        return this.config.types.BeaconBlock.fromJson((transformedResponseData as unknown) as Json, {
            case: "snake",
        });
    };

    public produceAttestationData = async (index: CommitteeIndex, slot: Slot): Promise<AttestationData> => {
        const query = querystring.stringify({
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            committee_index: index,
            slot,
        });
        const responseData = await this.httpClient.get<PrysmAttestationData>(
            `/eth/v1alpha1/validator/attestation?${query}`,
        );
        return this.config.types.AttestationData.fromJson((mapAttestationData(responseData) as unknown) as Json, {
            case: "snake",
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getAggregatedAttestation = async (attestationDataRoot: Root, slot: Slot): Promise<Attestation> => {
        throw new Error("getAggregatedAttestation not implemented");
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public publishAggregateAndProofs = async (signedAggregateAndProofs: SignedAggregateAndProof[]): Promise<void> => {
        throw new Error("publishAggregateAndProofs not implemented");
    };
}
