import {CgEth2BeaconBlocksApi} from "../eth2ApiClient/cgEth2BeaconBlocksApi";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {HttpClient} from "../../../api";
import {SignedBeaconBlock} from "@chainsafe/lodestar-types";
import {matomo} from "../../../tracking";

export class CgPrysmEth2BeaconBlocksApi extends CgEth2BeaconBlocksApi {
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        super(config, httpClient);
    }

    // TODO: adjust to work with prysm
    public publishBlock = async (block: SignedBeaconBlock): Promise<void> => {
        console.warn("publishBlock");
        await this.httpClient.post(
            "/eth/v1/beacon/blocks",
            this.config.types.SignedBeaconBlock.toJson(block, {case: "snake"}),
        );
        if (process.env.NODE_ENV !== "validator-test")
            if (matomo) matomo.trackEvent({category: "block", action: "proposed", value: block.message.slot});
    };

    // TODO: implement method "getBlock"

    // TODO: implement method "getBlockAttestations"
}
