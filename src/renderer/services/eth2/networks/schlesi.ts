import {config as mainnetBeaconConfig} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import {ethers} from "ethers";
import {BeaconChain} from "../../docker/chain";
import {IDockerRunParams} from "../../docker/type";
import {SupportedNetworks} from "../supportedNetworks";
import {INetworkConfig} from "../../interfaces";

const eth1Endpoint = "https://goerli.infura.io/v3/9b8caef145c74574869579199c47e847";

const dockerConfig: IDockerRunParams = {
    name: BeaconChain.getContainerName(SupportedNetworks.SCHLESI),
    image: "sigp/lighthouse:latest",
    restart: "unless-stopped",
    cmd: `lighthouse beacon --http --http-address 0.0.0.0 --eth1-endpoint ${eth1Endpoint}`,
    volume: `${SupportedNetworks.SCHLESI}-chain-data:/root/.lighthouse`,
    ports: [
        {
            local: "9000",
            host: "9000",
        },
        {
            local: "5052",
            host: "5052",
        }
    ]
};

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
    eth1Provider: ethers.getDefaultProvider("goerli"),
    dockerConfig,
});
