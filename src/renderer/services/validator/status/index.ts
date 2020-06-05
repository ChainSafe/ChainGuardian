import {ValidatorStatus} from "./statuses";
import {warn} from "electron-log";
import {IEth1Client} from "../../deposit/ethers";
import {IGenericEth2Client} from "../../eth2/client/interface";
import {BLSPubkey} from "@chainsafe/lodestar-types";
import {computeEpochAtSlot, FAR_FUTURE_EPOCH} from "@chainsafe/lodestar-beacon-state-transition";
import {PublicKey} from "@chainsafe/bls";

export * from "./statuses";

export async function getValidatorStatus(
    validatorPubKey: BLSPubkey,
    eth2Api: IGenericEth2Client,
    eth1: IEth1Client
): Promise<ValidatorStatus> {
    if(!(await isBeaconNodeWorking(eth2Api))) {
        return ValidatorStatus.BEACON_ERROR;
    }
    if(!(await hasChainStarted(eth2Api))) {
        return ValidatorStatus.WAITING_START;
    }
    if(await isBeaconNodeSyncing(eth2Api)) {
        return ValidatorStatus.SYNCING;
    }
    const validator = await eth2Api.beacon.getValidator(validatorPubKey);
    if(validator) {
        const currentEpoch = computeEpochAtSlot(eth2Api.config, eth2Api.getCurrentSlot());
        if(validator.validator.activationEpoch !== FAR_FUTURE_EPOCH 
            && currentEpoch < validator.validator.activationEpoch) {
            return ValidatorStatus.ACTIVATION_QUEUE;
        }
        if(validator.validator.slashed) {
            return ValidatorStatus.SLASHED;
        }
        if(validator.validator.exitEpoch !== FAR_FUTURE_EPOCH) {
            if(currentEpoch > validator.validator.exitEpoch) {
                return ValidatorStatus.EXITED;
            } else {
                return ValidatorStatus.EXIT_QUEUE;
            }
        }
        return ValidatorStatus.ACTIVE;
    } else {
        if(await hasDeposited(validatorPubKey, eth1)) {
            return ValidatorStatus.ACTIVATION_QUEUE;
        } else {
            return ValidatorStatus.WAITING_DEPOSIT;
        }
    }
}

async function isBeaconNodeWorking(eth2Api: IGenericEth2Client|null): Promise<boolean> {
    if(!eth2Api) return false;
    try {
        await eth2Api.beacon.getClientVersion();
        return true;
    } catch (e) {
        return false;
    }
}

async function hasChainStarted(eth2Api: IGenericEth2Client): Promise<boolean> {
    try {
        return !!await eth2Api.beacon.getGenesisTime();
    } catch (e) {
        warn("Failed to get genesis time", e);
        return false;
    }
}

async function isBeaconNodeSyncing(eth2Api: IGenericEth2Client): Promise<boolean> {
    try {
        return !!await eth2Api.beacon.getSyncingStatus();
    } catch (e) {
        warn("Failed to get syncing status", e);
        return true;
    }
}

async function hasDeposited(pubkey: BLSPubkey, eth1: IEth1Client): Promise<boolean> {
    return await eth1.hasUserDeposited(PublicKey.fromBytes(pubkey as Uint8Array));
}
