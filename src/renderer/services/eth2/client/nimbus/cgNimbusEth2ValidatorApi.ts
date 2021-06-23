import {CgEth2ValidatorApi} from "../eth2ApiClient/cgEth2ValidatorApi";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {HttpClient} from "../../../api";
import {CommitteeIndex, Slot, ValidatorIndex} from "@chainsafe/lodestar-types";
import {cgLogger} from "../../../../../main/logger";

export class CgNimbusEth2ValidatorApi extends CgEth2ValidatorApi {
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        super(config, httpClient);
    }

    public prepareBeaconCommitteeSubnet = async (
        validatorIndex: ValidatorIndex,
        committeeIndex: CommitteeIndex,
        committeesAtSlot: number,
        slot: Slot,
        isAggregator: boolean,
    ): Promise<void> => {
        const params = [
            committeeIndex,
            slot,
            isAggregator,
            // Hardoded localtestnet adress
            "0x8309a5281dd43297a3eccc1e70553831ec4dbf6a0b5b38fc910b49fb4eecf37075c90269443fd5fc6b8cad701e3eec53",
            // TODO: missing param `slot_signature`;
            // eslint-disable-next-line max-len
            // https://github.com/status-im/nimbus-eth2/blob/44f652f704f14c67e648f2b14dee652d44b858c5/beacon_chain/rpc/validator_api.nim#L122
            "",
        ];

        cgLogger.log(params);

        const client = new HttpClient("http://localhost:9190");
        const response = await client.get("", {
            data: {
                jsonrpc: "2.0",
                method: "post_v1_validator_beacon_committee_subscriptions",
                params,
                id: 1,
            },
        });

        cgLogger.log(JSON.stringify(response));
    };
}
