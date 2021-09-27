import {INetworkConfig} from "../../interfaces";
import {LocalhostConfig} from "./local";
import {PyrmontConfig} from "./pyrmont";
import {fromHex} from "@chainsafe/lodestar-utils";

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
    const genesisBuffer = fromHex(genesisVersion);
    const result = networks.filter((network) => {
        return genesisBuffer.every((e, i) => network.eth2Config.GENESIS_FORK_VERSION[i] === e);
    });
    return result.length ? result[0] : null;
};

export {networks, getNetworkConfig, getNetworkConfigByGenesisVersion, networksList, defaultNetworkIndex};
