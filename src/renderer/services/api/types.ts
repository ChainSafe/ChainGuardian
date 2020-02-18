import {Fork, number64, SyncingStatus} from "@chainsafe/eth2.0-types";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {AnyContainerType} from "@chainsafe/ssz";

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
                ["startingBlock", "bigint"],
                ["currentBlock", "bigint"],
                ["highestBlock", "bigint"],
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