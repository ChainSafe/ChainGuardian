import {getNetworkConfig} from "../networks";
import {IGenericEth2Client} from "./interface";

export function getEth2ApiClient(url: string, network: string): IGenericEth2Client|undefined {
    const networkConfig = getNetworkConfig(network);
    if (!networkConfig) {
        return undefined;
    }

    switch(network) {
        // case SupportedNetworks.PRYSM:
        //     return new PrysmEth2ApiClient({
        //         baseUrl: url,
        //         config: networkConfig.eth2Config
        //     });
        default:
            return undefined;
    }
}
