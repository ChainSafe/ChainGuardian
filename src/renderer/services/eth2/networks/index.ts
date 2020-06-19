import {INetworkConfig} from "../../interfaces";
import {LocalhostConfig} from "./local";
import {SchlesiConfig} from "./schlesi";

const networks: INetworkConfig[] = [
    SchlesiConfig,
];

const isLocal = process.env.NODE_ENV !== "production";
if (isLocal) {
    networks.push(LocalhostConfig);
}

const defaultNetworkIndex = 0;

const getNetworkConfig = (name: string): INetworkConfig => {
    const result = networks.filter((network) => network.networkName === name);
    return (result.length === 0) ? networks[defaultNetworkIndex] : result[0];
};

const networksList = networks.map((contract) => contract.networkName);

const getNetworkConfigByGenesisVersion = (genesisVersion: string): null | INetworkConfig => {
    const genesisBuffer = Buffer.from(genesisVersion);
    const result = networks.filter((network) => genesisBuffer.equals(network.eth2Config.params.GENESIS_FORK_VERSION));
    return (result.length > 0) ? result[0] : null;
};

export {
    networks,
    getNetworkConfig,
    getNetworkConfigByGenesisVersion,
    networksList,
    defaultNetworkIndex,
};
