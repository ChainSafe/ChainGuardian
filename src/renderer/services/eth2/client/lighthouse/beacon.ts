import {IBeaconApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {
    BLSPubkey,
    Bytes32,
    Fork,
    Number64,
    Root,
    SyncingStatus,
    Uint64,
    ValidatorResponse
} from "@chainsafe/lodestar-types";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {IBeaconClientOptions} from "../interface";
import { Json, toHexString } from '@chainsafe/ssz';
import {LighthouseRoutes} from "./routes";
import {ILighthouseSyncResponse} from "./types";
import {objectToCamelCase} from "@chainsafe/lodestar-utils/lib/misc";
import {parse as bigIntParse} from "json-bigint";


export class LighthouseBeaconApiClient implements IBeaconApi {

    private client: HttpClient;
    private config: IBeaconConfig;

    public constructor(options: IBeaconClientOptions) {
        this.client = new HttpClient(options.baseUrl, {axios: {transformResponse: bigIntParse}});
        this.config = options.config;
    }
    
    public async getClientVersion(): Promise<Bytes32> {
        const response = await this.client.get<string>(LighthouseRoutes.GET_VERSION);
        return Buffer.from(response, "utf8");
    }

    public async getFork(): Promise<{
        fork: Fork;
        chainId: Uint64;
        genesisValidatorsRoot: Root;
    }> {
        const [validatorsRootResponse, forkResponse] = await Promise.all([
            this.client.get<string>(LighthouseRoutes.GET_GENESIS_VALIDATORS_ROOT),
            this.client.get<Json>(LighthouseRoutes.GET_FORK)
        ]);
        return {
            fork: this.config.types.Fork.fromJson(objectToCamelCase(forkResponse as object) as Json),
            genesisValidatorsRoot: this.config.types.Root.fromJson(validatorsRootResponse),
            chainId: BigInt(0)
        };
    }

    public async getGenesisTime(): Promise<Number64> {
        return await this.client.get<number>(LighthouseRoutes.GET_GENESIS_TIME);
    }

    public async getSyncingStatus(): Promise<boolean | SyncingStatus> {
        const response = await this.client.get<ILighthouseSyncResponse>(LighthouseRoutes.GET_SYNC_STATUS);
        if(Object.keys(response).includes("Synced")) {
            return false;
        }
        if(response.SyncingFinalized) {
            return {
                currentBlock: BigInt(response.SyncingFinalized.head_slot),
                highestBlock: BigInt(response.SyncingFinalized.head_slot),
                startingBlock: BigInt(response.SyncingFinalized.start_slot)
            };
        }
        if(response.SyncingHead) {
            return {
                currentBlock: BigInt(response.SyncingHead.head_slot),
                highestBlock: BigInt(response.SyncingHead.head_slot),
                startingBlock: BigInt(response.SyncingHead.start_slot)
            };
        }
    }

    public async getValidator(pubkey: BLSPubkey): Promise<ValidatorResponse | null> {
        const validatorResponse = await this.client.post<{pubkeys: string[]}, Json[]>(
            LighthouseRoutes.GET_VALIDATORS,
            {pubkeys: [this.config.types.BLSPubkey.toJson(pubkey) as string]}
        );
        // @ts-ignore
        const validator = validatorResponse.find((validatorJson) => validatorJson.pubkey === toHexString(pubkey));
        // @ts-ignore
        if(!validator || !validator.validator) {
            return null;
        }
        //naming issues, hopefully removed with standardized api
        // @ts-ignore
        validatorResponse[0].index = validatorResponse[0].validator_index;
        return this.config.types.ValidatorResponse.fromJson(objectToCamelCase(validatorResponse[0] as object) as Json);
    }

}