import {config as mainnetBeaconConfig} from "@chainsafe/eth2.0-config/lib/presets/mainnet";
import {config as minimalBeaconConfig} from "@chainsafe/eth2.0-config/lib/presets/minimal";

const isLocal = process.env.NODE_ENV !== "production";

const networks = [
    {
        networkName: "Dummy",
        address: "0x00000000000001",
        depositAmount: 32,
        beaconConfig: mainnetBeaconConfig,
        networkId: 0
    },
];

if(isLocal) {
    networks.push({
        networkName: "Local",
        address: "0x2F1598e74b146F5687174C13f8EDCF490B2492e3",
        beaconConfig: minimalBeaconConfig,
        networkId: 999,
        depositAmount: 32
    });
}

export {networks};