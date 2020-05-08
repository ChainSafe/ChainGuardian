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

const getNetworkConfig = (name: string): null | INetworkConfig => {
    const result = networks.filter((network) => network.networkName === name);
    return (result.length === 0) ? null : result[0];
};

const networksList = networks.map((contract) => contract.networkName);

const defaultNetworkIndex = 0;

export {
    networks,
    getNetworkConfig,
    networksList,
    defaultNetworkIndex,
};
