import {CgEth2BeaconBlocksApi} from "../eth2ApiClient/cgEth2BeaconBlocksApi";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {HttpClient} from "../../../api";
import {SignedBeaconBlock} from "@chainsafe/lodestar-types";
import {matomo} from "../../../tracking";
import {SignedBeaconBlockData} from "./map.types";
import {mapProduceBlockDataToPrysmProduceBlock} from "./mapProduceBlockDataToPrysmProduceBlock";

export class CgPrysmEth2BeaconBlocksApi extends CgEth2BeaconBlocksApi {
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        super(config, httpClient);
    }

    public publishBlock = async (block: SignedBeaconBlock): Promise<void> => {
        const data = (this.config.types.SignedBeaconBlock.toJson(block, {
            case: "snake",
        }) as unknown) as SignedBeaconBlockData;
        console.log(JSON.stringify(data, undefined, 2));
        console.log(JSON.stringify(mapProduceBlockDataToPrysmProduceBlock(data), undefined, 2));
        await this.httpClient.post("/eth/v1alpha1/validator/block", mapProduceBlockDataToPrysmProduceBlock(data));

        if (process.env.NODE_ENV !== "validator-test")
            if (matomo) matomo.trackEvent({category: "block", action: "proposed", value: block.message.slot});
    };

    // TODO: implement method "getBlock"

    // TODO: implement method "getBlockAttestations"
}
