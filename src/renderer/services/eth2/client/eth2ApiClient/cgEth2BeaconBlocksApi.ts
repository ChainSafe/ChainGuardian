import {IBeaconBlocksApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {SignedBeaconBlock} from "@chainsafe/lodestar-types";

export class CgEth2BeaconBlocksApi implements IBeaconBlocksApi {
    private readonly httpClient: HttpClient;
    private readonly config: IBeaconConfig;
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        this.config = config;
        this.httpClient = httpClient;
    }

    public publishBlock = async (block: SignedBeaconBlock): Promise<void> => {
        await this.httpClient.post(
            "/eth/v1/beacon/blocks",
            this.config.types.SignedBeaconBlock.toJson(block, {case: "snake"}),
        );
    };
}
