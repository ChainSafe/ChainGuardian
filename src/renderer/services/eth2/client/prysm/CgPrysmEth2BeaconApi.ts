import {CgEth2BeaconApi} from "../eth2ApiClient/CgEth2BeaconApi";
import {altair, ssz} from "@chainsafe/lodestar-types";

export class CgPrysmEth2BeaconApi extends CgEth2BeaconApi {
    public async submitPoolSyncCommitteeSignatures(signatures: altair.SyncCommitteeMessage[]): Promise<void> {
        const data = signatures.map((signature) => ssz.altair.SyncCommitteeMessage.toJson(signature, {case: "snake"}));
        console.log(data, signatures);
        await this.post("/eth/v1/beacon/pool/sync_committees", data);
    }
}
