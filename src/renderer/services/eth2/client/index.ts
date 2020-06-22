import {INetworkConfig} from "../../interfaces";
import {getNetworkConfig, getNetworkConfigByGenesisVersion} from "../networks";
import {SupportedNetworks} from "../supportedNetworks";
import {IGenericEth2Client} from "./interface";
import {LighthouseEth2ApiClient} from "./lighthouse/lighthouse";
import {ILogger, WinstonLogger} from "@chainsafe/lodestar-utils";

export function getEth2ApiClient(url: string, network: string, logger?: ILogger): IGenericEth2Client|undefined {
    const networkConfig = getNetworkConfig(network);
    if (!networkConfig) {
        return undefined;
    }
    if(!logger) {
        logger = new WinstonLogger();
    }

    switch(network) {
        // case SupportedNetworks.PRYSM:
        //     return new PrysmEth2ApiClient({
        //         baseUrl: url,
        //         config: networkConfig.eth2Config
        //     });
        case SupportedNetworks.SCHLESI:
            return new LighthouseEth2ApiClient({
                baseUrl: url,
                logger,
                config: networkConfig.eth2Config
            });
        default:
            return new LighthouseEth2ApiClient({
                baseUrl: url,
                logger,
                config: networkConfig.eth2Config
            });
    }
}

export async function readBeaconChainNetwork(url: string): Promise<INetworkConfig | null> {
    const client = getEth2ApiClient(url, "unknown");
    const spec = await client.beacon.getSpec();
    return getNetworkConfigByGenesisVersion(spec.genesisForkVersion);
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
