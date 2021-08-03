import {CgEth2ValidatorApi} from "../eth2ApiClient/cgEth2ValidatorApi";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {HttpClient} from "../../../api";
import {CommitteeIndex, Slot, ValidatorIndex} from "@chainsafe/lodestar-types";

export class CgNimbusEth2ValidatorApi extends CgEth2ValidatorApi {
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        super(config, httpClient);
    }

    public prepareBeaconCommitteeSubnet = async (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validatorIndex: ValidatorIndex,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        committeeIndex: CommitteeIndex,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        committeesAtSlot: number,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        slot: Slot,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        isAggregator: boolean,
    ): Promise<void> => {
        // Intentionally left empty!
    };
}
