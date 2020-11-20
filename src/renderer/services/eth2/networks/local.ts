import {config as minimalBeaconConfig} from "@chainsafe/lodestar-config/lib/presets/minimal";
import {INetworkConfig} from "../../interfaces";
import {ethers} from "ethers";

export const LocalhostConfig: INetworkConfig = Object.freeze({
    networkName: "localhost",
    networkId: 999,
    eth2Config: {
        ...minimalBeaconConfig,
        params: {
            ...minimalBeaconConfig.params,
            GENESIS_FORK_VERSION: Buffer.from("0x00000001"),
        },
    },
    eth1Provider: new ethers.providers.JsonRpcProvider("http://localhost:8545"),
    dockerConfig: {
        name: "lighthouse_validators",
        image: "sigp/lighthouse",
        ports: [
            {
                local: "9000",
                host: "9000",
            },
            {
                local: "5052",
                host: "5052",
            },
        ],
    },
});
