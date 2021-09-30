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
        // eslint-disable-next-line camelcase
        const response = await this.post<Json, {data: Json[]; dependent_root: Json}>(
            `/eth/v1/validator/duties/sync/${epoch}`,
            validatorIndices.map(String),
        );

        // TODO: remove ts ignore
        // @ts-ignore
        return {
            data: response.data.map((data) => syncDutyContainerType.fromJson(data, {case: "snake"})),
            // dependentRoot: ssz.Root.fromJson(response.dependent_root),
        };
    }
}
