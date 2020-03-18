import {Fork, number64, SyncingStatus} from "@chainsafe/eth2.0-types";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {IBeaconApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {AnyContainerType} from "@chainsafe/ssz";
import {ChainHead} from "./prysm/types";

export interface IChainFork {
    chainId: number64,
    fork: Fork
}

export function getChainForkSSZType(config: IBeaconConfig): AnyContainerType {
    return {
        fields: [
            ["chainId", "number64"],
            ["fork", config.types.Fork]
        ]
    };
}

export interface ISyncing {
    isSyncing: boolean,
    syncStatus: SyncingStatus
}

export const SyncingSSZType: AnyContainerType = {
    fields: [
        ["isSyncing", "bool"],
        ["syncStatus", {
            fields: [
                ["startingBlock", "bigint64"],
                ["currentBlock", "bigint64"],
                ["highestBlock", "bigint64"],
            ]
        }]
    ],
};

export const ValidatorDutySSZTyoe: AnyContainerType = {
    fields: [
        ["validatorPubkey", "bytes48"],
        ["committeeIndex", "number64"],
        ["attestationSlot", "number64"],
    ]
};

// Required until lodestar implements all methods
export interface IBeaconApiClient extends IBeaconApi {
    getChainHead(): Promise<ChainHead>
}
