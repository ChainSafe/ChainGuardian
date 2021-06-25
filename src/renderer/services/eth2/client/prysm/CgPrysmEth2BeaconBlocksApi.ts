import {CgEth2BeaconBlocksApi} from "../eth2ApiClient/cgEth2BeaconBlocksApi";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {HttpClient} from "../../../api";
import {SignedBeaconBlock} from "@chainsafe/lodestar-types";
import {matomo} from "../../../tracking";
import {SignedBeaconBlockData} from "./map.types";
import {mapProduceBlockDataToPrysmProduceBlock} from "./mapProduceBlockDataToPrysmProduceBlock";
import {List} from "@chainsafe/ssz";
import {Attestation} from "@chainsafe/lodestar-types/lib/types/operations";
import {ChainHead, ListBlocksResponse} from "./types";
import querystring from "querystring";
import {mapProduceBlockResponseToStandardProduceBlock} from "./mapProduceBlockResponseToStandardProduceBlock";
import {base64ToHex} from "./utils";

export class CgPrysmEth2BeaconBlocksApi extends CgEth2BeaconBlocksApi {
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        super(config, httpClient);
    }

    public publishBlock = async (block: SignedBeaconBlock): Promise<void> => {
        const data = (this.config.types.SignedBeaconBlock.toJson(block, {
            case: "snake",
        }) as unknown) as SignedBeaconBlockData;
        await this.httpClient.post("/eth/v1alpha1/validator/block", mapProduceBlockDataToPrysmProduceBlock(data));

        if (process.env.NODE_ENV !== "validator-test" && matomo)
            matomo.trackEvent({category: "block", action: "proposed", value: block.message.slot});
    };

    public getBlock = async (blockId: "head" | "genesis" | "finalized" | number): Promise<SignedBeaconBlock> => {
        const slot = await (async (): Promise<number> => {
            if (typeof blockId === "string") {
                const data = await this.httpClient.get<ChainHead>("/eth/v1alpha1/beacon/chainhead");
                if (blockId === "head" || blockId === "genesis") return Number(data.headSlot);
                if (blockId === "finalized") return Number(data.finalizedSlot);
                throw new Error(`block id: ${blockId} dose not exist`);
            }
            return blockId;
        })();

        const query = querystring.stringify(
            blockId === "genesis"
                ? {genesis: true}
                : {
                      slot,
                  },
        );
        const response = await this.httpClient.get<ListBlocksResponse>(`/eth/v1alpha1/beacon/blocks?${query}`);
        const blocks = response.blockContainers.filter(({canonical}) => canonical);
        if (!blocks.length) throw new Error(`Block ${blockId} not found`);

        return this.config.types.SignedBeaconBlock.fromJson(
            {
                message: mapProduceBlockResponseToStandardProduceBlock(blocks[0].block.block),
                signature: base64ToHex(blocks[0].block.signature),
            },
            {case: "snake"},
        );
    };

    public getBlockAttestations = async (
        blockId: "head" | "genesis" | "finalized" | number,
    ): Promise<List<Attestation> | null> => {
        try {
            const block = await this.getBlock(blockId);

            if (typeof blockId === "number" && block.message.slot !== blockId) return null;
            return block.message.body.attestations;
        } catch {
            return null;
        }
    };
}
