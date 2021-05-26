import {CgEth2BeaconApi} from "../eth2ApiClient/cgEth2BeaconApi";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {HttpClient} from "../../../api";
import {Dispatch} from "redux";
import {CgPrysmEth2BeaconStateApi} from "./CgPrysmEth2BeaconStateApi";
import {Genesis} from "@chainsafe/lodestar-types";
import logger from "electron-log";
import {base64ToHex} from "./utils";

export class CgPrysmEth2BeaconApi extends CgEth2BeaconApi {
    public constructor(config: IBeaconConfig, httpClient: HttpClient, publicKey?: string, dispatch?: Dispatch) {
        super(config, httpClient, publicKey, dispatch);

        this.state = new CgPrysmEth2BeaconStateApi(config, httpClient);
    }

    public getGenesis = async (): Promise<Genesis | null> => {
        try {
            // eslint-disable-next-line camelcase
            const {genesisTime, genesisValidatorsRoot} = await this.httpClient.get<{
                genesisTime: string;
                genesisValidatorsRoot: string;
            }>("/eth/v1alpha1/node/genesis");

            const result = {
                genesisTime: Math.round(new Date(genesisTime).getTime() / 1000).toString(),
                genesisValidatorsRoot: base64ToHex(genesisValidatorsRoot),
                genesisForkVersion: "0x00000001",
            };

            return this.config.types.Genesis.fromJson(result, {case: "camel"});
        } catch (e) {
            logger.error("Failed to obtain genesis time", {error: e.message});
            return null;
        }
    };
}
