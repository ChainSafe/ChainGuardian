import {CgEth2ValidatorApi} from "../eth2ApiClient/cgEth2ValidatorApi";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {HttpClient} from "../../../api";
import {AttesterDuty, Epoch, ProposerDuty, ValidatorIndex} from "@chainsafe/lodestar-types";
import {Json} from "@chainsafe/ssz";
import {base64ToHex} from "./utils";
import {DutiesResponse, ValidatorStatusResponse, Assignments} from "./types";

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
}
