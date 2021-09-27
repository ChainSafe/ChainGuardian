import {CgEth2ValidatorApi} from "../eth2ApiClient/CgEth2ValidatorApi";
import {BeaconCommitteeSubscription} from "@chainsafe/lodestar-api/lib/routes/validator";

export class CgNimbusEth2ValidatorApi extends CgEth2ValidatorApi {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/explicit-member-accessibility
    async prepareBeaconCommitteeSubnet(subscriptions: BeaconCommitteeSubscription[]): Promise<void> {
        // Intentionally left empty! TODO: update when nimbus implement this endpoint (last check v1.4.2 2.9.2021)
    }
}
