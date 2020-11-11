import {Validator} from "@chainsafe/lodestar-types";
import {FAR_FUTURE_EPOCH} from "@chainsafe/lodestar-beacon-state-transition";

export function generateValidator(opts: Partial<Validator>): Validator {
    return {
        activationEligibilityEpoch: 0,
        activationEpoch: 0,
        effectiveBalance: BigInt(32),
        exitEpoch: FAR_FUTURE_EPOCH,
        slashed: false,
        pubkey: Buffer.alloc(48, 1),
        withdrawableEpoch: FAR_FUTURE_EPOCH,
        withdrawalCredentials: Buffer.alloc(48, 1),
        ...opts,
    };
}
