import {INetworkConfig} from "../../interfaces";
import {getNetworkConfig, getNetworkConfigByGenesisVersion} from "../networks";
import {ICgEth2ApiClient} from "./interface";
import {ILogger, WinstonLogger} from "@chainsafe/lodestar-utils";

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const client = getEth2ApiClient(url, "unknown");
    return getNetworkConfigByGenesisVersion("0x000000000");
}

export async function isSupportedBeaconChain(url: string, network: string): Promise<boolean> {
    const client = getEth2ApiClient(url, network);
    try {
        const version = await client.getVersion();
        return version.startsWith("Lighthouse");
    } catch (e) {
        return false;
    }
}
