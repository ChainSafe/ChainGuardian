import {INetworkConfig} from "../../interfaces";
import {getNetworkConfig, getNetworkConfigByGenesisVersion} from "../networks";
import {ICgEth2ApiClient} from "./interface";
import {HttpClient} from "../../api";

export function getEth2ApiClient(url: string, network: string): ICgEth2ApiClient | undefined {
    const networkConfig = getNetworkConfig(network);
    if (!networkConfig) {
        return undefined;
    }

    switch (network) {
        default:
    }
}

export async function readBeaconChainNetwork(url: string): Promise<INetworkConfig | null> {
    // eslint-disable-next-line camelcase
    type GenesisResponseType = {data: {genesis_fork_version: string}};
    try {
        const genesisResponse = await new HttpClient(url).get<GenesisResponseType>("/eth/v1/beacon/genesis");
        return getNetworkConfigByGenesisVersion(genesisResponse.data.genesis_fork_version);
    } catch {
        return null;
    }
}
