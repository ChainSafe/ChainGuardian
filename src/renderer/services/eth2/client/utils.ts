import {INetworkConfig} from "../../interfaces";
import {getNetworkConfig, getNetworkConfigByGenesisVersion} from "../networks";
import {HttpClient} from "../../api";
import {CgLighthouseEth2Api, CgTekuEth2Api, CgEth2ApiClient, CgNimbusEth2Api} from "./module";
import {CgPrysmEth2Api} from "./prysm";

export function getEth2ApiClient(url: string, network: string): typeof CgEth2ApiClient | undefined {
    const networkConfig = getNetworkConfig(network);
    if (!networkConfig) {
        return undefined;
    }

    switch (network) {
        default:
    }
}

export async function readBeaconChainNetwork(url: string, throwOnEmpty = false): Promise<INetworkConfig | null> {
    // eslint-disable-next-line camelcase
    type GenesisResponseType = {data: {genesis_fork_version: string}};
    try {
        const genesisResponse = await new HttpClient(url).get<GenesisResponseType>("/eth/v1/beacon/genesis");
        return getNetworkConfigByGenesisVersion(genesisResponse.data.genesis_fork_version);
    } catch (error) {
        if (throwOnEmpty) throw error;
        return null;
    }
}

export async function getBeaconNodeVersion(beaconNodeUrl: string): Promise<string> {
    try {
        const response = await new HttpClient(beaconNodeUrl).get<{data: {version: string}}>(`/eth/v1/node/version`);
        return response.data.version;
    } catch {
        return "unknown";
    }
}

export async function getBeaconNodeEth2ApiClient(beaconNodeUrl: string): Promise<typeof CgEth2ApiClient> {
    const version = (await getBeaconNodeVersion(beaconNodeUrl)).toLowerCase();

    switch (true) {
        case version.includes("nimbus"):
            return CgNimbusEth2Api;
        case version.includes("prysm"):
            return CgPrysmEth2Api;
        case version.includes("lighthouse"):
            return CgLighthouseEth2Api;
        case version.includes("teku"):
            return CgTekuEth2Api;
        default:
            return CgEth2ApiClient;
    }
}
