import {config as mainnetBeaconConfig} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import {ethers} from "ethers";
import {BeaconChain} from "../../docker/chain";
import {IDockerRunParams} from "../../docker/type";
import {SupportedNetworks} from "../supportedNetworks";
import {INetworkConfig} from "../../interfaces";

const dockerConfig: IDockerRunParams = {
    name: BeaconChain.getContainerName(SupportedNetworks.PRYSM),
    image: "gcr.io/prysmaticlabs/prysm/beacon-chain:latest",
    restart: "unless-stopped",
    volume: "/data",
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
};

export const PrysmConfig: INetworkConfig = Object.freeze({
    networkName: SupportedNetworks.PRYSM,
    networkId: 5,
    contract: {
        address: "0xD775140349E6A5D12524C6ccc3d6A1d4519D4029",
        depositAmount: 3.2,
        bytecode: "0x",
        deployedAtBlock: 1259282
    },
    eth2Config: {
        ...mainnetBeaconConfig,
        params: {
            ...mainnetBeaconConfig.params,
            MAX_EFFECTIVE_BALANCE: BigInt(3200000000000000000),
            GENESIS_FORK_VERSION: Buffer.from([0, 0, 0, 4]),
            EJECTION_BALANCE: BigInt(1600000000000000000)
        }
    },
    eth1Provider: ethers.getDefaultProvider("goerli"),
    dockerConfig,
});
