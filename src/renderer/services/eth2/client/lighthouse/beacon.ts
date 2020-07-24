import {BLSPubkey, Fork, Number64, Root, Uint64, ValidatorResponse} from "@chainsafe/lodestar-types";
import {ISpecResponse, SpecType} from "../../../../models/types/beaconNode";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {IBeaconClientOptions, IEth2BeaconApi} from "../interface";
import {Json, toHexString} from "@chainsafe/ssz";
import {LighthouseRoutes} from "./routes";
import {Eth2ChainHeadType, IEth2ChainHead} from "../../../../models/types/head";
import {ILogger} from "@chainsafe/lodestar-utils";
import {axiosConfig} from "./axios";


export class LighthouseBeaconApiClient implements IEth2BeaconApi {

    private client: HttpClient;
    private readonly config: IBeaconConfig;
    private readonly logger: ILogger;

    public constructor(options: IBeaconClientOptions) {
        this.client = new HttpClient(options.baseUrl, {
            axios: axiosConfig
        });
        this.config = options.config;
        this.logger = options.logger;
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
            fork: this.config.types.Fork.fromJson(forkResponse, {case: "snake"}),
            genesisValidatorsRoot: this.config.types.Root.fromJson(validatorsRootResponse, {case: "snake"}),
            chainId: BigInt(0)
        };
    }

    public async getGenesisTime(): Promise<Number64> {
        try {
            return await this.client.get<number>(LighthouseRoutes.GET_GENESIS_TIME);
        } catch (e) {
            this.logger.warn("Failed to get genesis time. Error: " + e.message);
            return 0;
        }
    }

    public async getValidator(pubkey: BLSPubkey): Promise<ValidatorResponse | null> {
        const validatorResponse = await this.client.post<{ pubkeys: string[] }, Json[]>(
            LighthouseRoutes.GET_VALIDATORS,
            {pubkeys: [this.config.types.BLSPubkey.toJson(pubkey, {case: "snake"}) as string]}
        );
        const validator = validatorResponse.find((validatorJson) =>
            // @ts-ignore
            validatorJson.pubkey === toHexString(pubkey)
        );
        // @ts-ignore
        if (!validator || !validator.validator) {
            return null;
        }
        //naming issues, hopefully removed with standardized api
        // @ts-ignore
        validatorResponse[0].index = validatorResponse[0].validator_index;
        return this.config.types.ValidatorResponse.fromJson(validatorResponse[0], {case: "snake"});
    }

    public async getValidators(pubkeys: BLSPubkey[]): Promise<ValidatorResponse[]> {
        const publicKeys = pubkeys.map(pubkey => (
            this.config.types.BLSPubkey.toJson(pubkey, {case: "snake"}) as string
        ));
        const validatorResponse = (await this.client.post<{ pubkeys: string[] }, Json[]>(
            LighthouseRoutes.GET_VALIDATORS,
            {pubkeys: publicKeys}
        ))
        // remove null validators
        // @ts-ignore
            .filter((v) => !!v.validator_index);

        validatorResponse.forEach((_, i) => {
            // @ts-ignore
            validatorResponse[i].index = validatorResponse[i].validator_index;
        });

        return validatorResponse.map(v => (
            this.config.types.ValidatorResponse.fromJson(v, {case: "snake"})
        ));
    }

    public async getChainHead(): Promise<IEth2ChainHead> {
        return Eth2ChainHeadType.fromJson(
            await this.client.get<Json>(LighthouseRoutes.GET_HEAD),
            {case: "snake"}
        );
    }

    public async getSpec(): Promise<ISpecResponse> {
        return SpecType.fromJson(
            await this.client.get<Json>(LighthouseRoutes.GET_SPEC),
            {case: "snake"}
        );
    }

}
