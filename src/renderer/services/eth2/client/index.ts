import {getNetworkConfig} from "../networks";
import {SupportedNetworks} from "../supportedNetworks";
import {IGenericEth2Client} from "./interface";
import {PrysmEth2ApiClient} from "./prysm/prysm";

export function getEth2ApiClient(url: string, network: string): IGenericEth2Client|undefined {
    const networkConfig = getNetworkConfig(network);
    if (!networkConfig) {
        return undefined;
    }

    switch(network) {
        case SupportedNetworks.PRYSM:
            return new PrysmEth2ApiClient({
                baseUrl: url,
                config: networkConfig.eth2Config
            });
        default:
            return undefined;
    }
}
