import {SupportedNetworks} from "../eth2/supportedNetworks";
import {BeaconChain} from "./chain";
import {IDockerRunParams} from "./type";

export const getLighthouseBeaconChainConfig = (network: SupportedNetworks): IDockerRunParams => ({
    name: BeaconChain.getContainerName(network),
    image: "sigp/lighthouse:latest",
    restart: "unless-stopped",
    cmd: "lighthouse beacon --http --http-address 0.0.0.0 --eth1-endpoint https://goerli.infura.io/v3/9b8caef145c74574869579199c47e847",
    volume: `${network}-chain-data:/root/.lighthouse`,
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
});

export const getPrysmBeaconChainConfig = (network: SupportedNetworks): IDockerRunParams => ({
    name: BeaconChain.getContainerName(network),
    image: "gcr.io/prysmaticlabs/prysm/beacon-chain:latest",
    restart: "unless-stopped",
    volume: `${network}-chain-data:/data`,
    cmd: "--datadir=/data --grpc-gateway-port 4001",
    ports: [
        {
            local: "4000",
            host: "4001",
        },
        {
            local: "13000",
            host: "13000",
        }
    ]
});

export const getNetworkBeaconChainConfig = (network: string): IDockerRunParams => {
    if (network === SupportedNetworks.PRYSM) {
        return getPrysmBeaconChainConfig(SupportedNetworks.PRYSM);
    } else if (network === SupportedNetworks.SCHLESI) {
        return getLighthouseBeaconChainConfig(SupportedNetworks.SCHLESI);
    } else {
        return getLighthouseBeaconChainConfig(SupportedNetworks.SCHLESI);
    }
};
