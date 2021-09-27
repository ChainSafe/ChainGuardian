import {CgEth2ValidatorApi} from "../eth2ApiClient/CgEth2ValidatorApi";
import {Root, ValidatorIndex} from "@chainsafe/lodestar-types";
import {SyncDuty} from "@chainsafe/lodestar-api/lib/routes/validator";
import {Json} from "@chainsafe/ssz";
import {syncDutyContainerType} from "../ssz";

export class CgPrysmEth2ValidatorApi extends CgEth2ValidatorApi {
    public async getSyncCommitteeDuties(
        epoch: number,
        validatorIndices: ValidatorIndex[],
    ): Promise<{data: SyncDuty[]; dependentRoot: Root}> {
        console.warn(epoch, validatorIndices);

        // eslint-disable-next-line camelcase
        const response = await this.post<Json, {data: Json[]; dependent_root: Json}>(
            `/eth/v1/validator/duties/sync/${epoch}`,
            validatorIndices.map(String),
        );

        console.warn(response.data);

        // TODO: remove ts ignore
        // @ts-ignore
        return {
            data: response.data
                // @ts-ignore
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                .map((data) => ({...data, validator_index: Number(data.validator_index)}))
                .map((data) => syncDutyContainerType.fromJson(data, {case: "snake"})),
            // dependentRoot: ssz.Root.fromJson(response.dependent_root),
        };
    }
}
