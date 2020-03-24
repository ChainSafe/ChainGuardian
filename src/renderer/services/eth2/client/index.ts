import {getNetworkConfig} from "../networks";
import {SupportedNetworks} from "../supportedNetworks";
import {IGenericEth2Client} from "./interface";
import {PrysmEth2ApiClient} from "./prysm/prysm";

export function getEth2ApiClient(url: string, network: string): IGenericEth2Client|null {
    const networkConfig = getNetworkConfig(network);
    if (!networkConfig) {
        return null;
    }

    switch(network) {
        case SupportedNetworks.PRYSM:
            return new PrysmEth2ApiClient({
                baseUrl: url,
                config: networkConfig.eth2Config
            });
        default:
            return null;
    }
}
