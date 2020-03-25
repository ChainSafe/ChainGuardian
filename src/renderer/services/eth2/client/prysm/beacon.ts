import {BLSPubkey, Bytes32, Fork, Number64, SyncingStatus, Uint64, Validator} from "@chainsafe/lodestar-types";
import {IBeaconClientOptions, IEth2BeaconApi} from "../interface";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {HttpClient} from "../../../api";
import {computeEpochAtSlot, getCurrentSlot} from "@chainsafe/lodestar-beacon-state-transition";
import {base64Decode, base64Encode, fromHex} from "../../../utils/bytes";
import {PrysmValidator} from "./types";
import {warn} from "electron-log";

export enum PrysmBeaconRoutes {
    VERSION = "/node/version",
    VALIDATOR = "/validator",
    DOMAIN = "/validator/domain",
    GENESIS = "/node/genesis",
    SYNCING = "/node/syncing"
}

export class PrysmBeaconApiClient implements IEth2BeaconApi {

    private client: HttpClient;
    private config: IBeaconConfig;
    
    public constructor(options: IBeaconClientOptions) {
        this.client = new HttpClient(options.urlPrefix);
        this.config = options.config;
    }
    
    public async getClientVersion(): Promise<Bytes32> {
        const response = await this.client.get<{version: string, metadata: string}>(PrysmBeaconRoutes.VERSION);
        return Buffer.from(response.version, "ascii");
    }
    
    public async getValidator(pubkey: BLSPubkey): Promise<Validator|null> {
        try {
            const response = await this.client.get<PrysmValidator>(
                PrysmBeaconRoutes.VALIDATOR,
                {
                    params: {
                        publicKey: base64Encode(pubkey.valueOf() as Uint8Array)
                    }
                });
            return fromPrysmaticJson<Validator>(this.config.types.Validator, {...response, pubkey: response.publicKey});
        } catch (e) {
            warn("Validator not found", e);
            return null;
        }
    }

    public async getFork(): Promise<{ fork: Fork; chainId: Uint64 }> {
        //TODO; move when epoch param is introduced
        const epoch = computeEpochAtSlot(this.config, getCurrentSlot(this.config, await this.getGenesisTime()));
        const response = await this.client.get<{signatureDomain: string}>(
            PrysmBeaconRoutes.DOMAIN,
            {params: {epoch, domain: base64Encode(fromHex("00000000"))}}
        );
        //first 4 bytes are domain type
        const version = base64Decode(response.signatureDomain).slice(4, 8);
        return {
            fork: {
                currentVersion: version,
                previousVersion: version,
                epoch
            },
            chainId: BigInt(0)
        };
    }

    public async getGenesisTime(): Promise<Number64> {
        const response = await this.client.get<{genesisTime: string}>(PrysmBeaconRoutes.GENESIS);
        return Math.floor(Date.parse(response.genesisTime) / 1000);
    }

    public async getSyncingStatus(): Promise<boolean | SyncingStatus> {
        const response = await this.client.get<{syncing: boolean}>(PrysmBeaconRoutes.SYNCING);
        return response.syncing;
    }

}