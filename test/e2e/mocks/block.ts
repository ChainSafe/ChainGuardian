import {BeaconBlock, SignedBeaconBlock} from "@chainsafe/lodestar-types/phase0";

export const ZERO_HASH = Buffer.alloc(32, 0);
export const EMPTY_SIGNATURE = Buffer.alloc(96, 0);

export function generateEmptyBlock(): BeaconBlock {
    return {
        slot: 0,
        parentRoot: Buffer.alloc(32),
        stateRoot: ZERO_HASH,
        proposerIndex: 0,
        body: {
            randaoReveal: Buffer.alloc(96),
            eth1Data: {
                depositRoot: Buffer.alloc(32),
                blockHash: Buffer.alloc(32),
                depositCount: 0,
            },
            graffiti: Buffer.alloc(32),
            proposerSlashings: [],
            attesterSlashings: [],
            attestations: [],
            deposits: [],
            voluntaryExits: [],
        },
    };
}

export function generateEmptySignedBlock(): SignedBeaconBlock {
    return {
        message: generateEmptyBlock(),
        signature: EMPTY_SIGNATURE,
    };
}
