import {INetworkConfig} from "../../interfaces";
import {getNetworkConfig, getNetworkConfigByGenesisVersion} from "../networks";
import {ICgEth2ApiClient} from "./interface";
import {ILogger, WinstonLogger} from "@chainsafe/lodestar-utils";
import {HttpClient} from "../../api";

export function getEth2ApiClient(url: string, network: string, logger?: ILogger): ICgEth2ApiClient | undefined {
    const networkConfig = getNetworkConfig(network);
    if (!networkConfig) {
        return undefined;
    }
    if (!logger) {
        logger = new WinstonLogger();
    }

    switch (network) {
        default:
        // return new LighthouseEth2ApiClient({
        //     baseUrl: url,
        //     logger,
        //     config: networkConfig.eth2Config,
        // });
    }
}

export async function readBeaconChainNetwork(url: string): Promise<INetworkConfig | null> {
    // eslint-disable-next-line camelcase
    type GenesisRequestType = {data: {genesis_fork_version: string}};
    try {
        const genesisResponse = await new HttpClient(url).get<GenesisRequestType>("/eth/v1/beacon/genesis");
        return getNetworkConfigByGenesisVersion(genesisResponse.data.genesis_fork_version);
    } catch {
        return null;
    }
}
