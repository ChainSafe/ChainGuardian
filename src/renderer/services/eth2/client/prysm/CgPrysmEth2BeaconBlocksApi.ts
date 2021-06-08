import {CgEth2BeaconBlocksApi} from "../eth2ApiClient/cgEth2BeaconBlocksApi";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {HttpClient} from "../../../api";
import {SignedBeaconBlock} from "@chainsafe/lodestar-types";
import {matomo} from "../../../tracking";
import {SignedBeaconBlockData} from "./map.types";
import {mapProduceBlockDataToPrysmProduceBlock} from "./mapProduceBlockDataToPrysmProduceBlock";
import {List} from "@chainsafe/ssz";
import {Attestation} from "@chainsafe/lodestar-types/lib/types/operations";

export class CgPrysmEth2BeaconBlocksApi extends CgEth2BeaconBlocksApi {
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        super(config, httpClient);
    }

    public publishBlock = async (block: SignedBeaconBlock): Promise<void> => {
        const data = (this.config.types.SignedBeaconBlock.toJson(block, {
            case: "snake",
        }) as unknown) as SignedBeaconBlockData;
        await this.httpClient.post("/eth/v1alpha1/validator/block", mapProduceBlockDataToPrysmProduceBlock(data));

        if (process.env.NODE_ENV !== "validator-test")
            if (matomo) matomo.trackEvent({category: "block", action: "proposed", value: block.message.slot});
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getBlock = async (blockId: "head" | "genesis" | "finalized" | number): Promise<SignedBeaconBlock> => {
        throw new Error("getBlock not implemented");
    };

    public getBlockAttestations = async (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        blockId: "head" | "genesis" | "finalized" | number,
    ): Promise<List<Attestation> | null> => {
        throw new Error("getBlockAttestations not implemented");
    };
}
