import {Validator} from "@chainsafe/eth2.0-types";
import {FAR_FUTURE_EPOCH} from "@chainsafe/eth2.0-state-transition/lib/constants";

export function generateValidator(opts: Partial<Validator>): Validator {
    return {
        activationEligibilityEpoch: 0,
        activationEpoch: 0,
        effectiveBalance: 32n,
        exitEpoch: FAR_FUTURE_EPOCH,
        slashed: false,
        pubkey: Buffer.alloc(48, 1),
        withdrawableEpoch: FAR_FUTURE_EPOCH,
        withdrawalCredentials: Buffer.alloc(48, 1),
        ...opts
    };
}