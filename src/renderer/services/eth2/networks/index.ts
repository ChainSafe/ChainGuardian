import {INetworkConfig} from "../../interfaces";
import {LocalhostConfig} from "./local";
import {PyrmontConfig} from "./pyrmont";
import {base64ToHex} from "../client/prysm/utils";

const networks: INetworkConfig[] = [PyrmontConfig];

const isLocal = process.env.NODE_ENV !== "production";
if (isLocal) {
    networks.push(LocalhostConfig);
}

const defaultNetworkIndex = 0;

const getNetworkConfig = (name: string): INetworkConfig => {
    const result = networks.filter((network) => network.networkName === name);
    return result.length === 0 ? networks[defaultNetworkIndex] : result[0];
};

const networksList = networks.map((contract) => contract.networkName);

const getNetworkConfigByGenesisVersion = (genesisVersion: string): null | INetworkConfig => {
    const genesisBuffer = Buffer.from(genesisVersion);
    const result = networks.filter((network) => genesisBuffer.equals(network.eth2Config.GENESIS_FORK_VERSION));
    if (result.length) return result[0];
    // TODO: remove when prysm update http endpoint
    const prysmGenesisBuffer = Buffer.from(base64ToHex(genesisVersion));
    const prysmResult = networks.filter((network) =>
        prysmGenesisBuffer.equals(network.eth2Config.GENESIS_FORK_VERSION),
    );
    return prysmResult.length > 0 ? prysmResult[0] : null;
};

export {networks, getNetworkConfig, getNetworkConfigByGenesisVersion, networksList, defaultNetworkIndex};
