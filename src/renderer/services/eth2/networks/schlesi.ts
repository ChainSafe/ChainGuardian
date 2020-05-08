import {config as mainnetBeaconConfig} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import {ethers} from "ethers";
import {SupportedNetworks} from "../supportedNetworks";
import {INetworkConfig} from "../../interfaces";

export const SchlesiConfig: INetworkConfig = Object.freeze({
    networkName: SupportedNetworks.SCHLESI,
    networkId: 5,
    contract: {
        address: "0xA15554BF93a052669B511ae29EA21f3581677ac5",
        depositAmount: 32,
        bytecode: "0x",
        deployedAtBlock: 2596126
    },
    eth2Config: mainnetBeaconConfig,
    eth1Provider: ethers.getDefaultProvider("goerli")
});
