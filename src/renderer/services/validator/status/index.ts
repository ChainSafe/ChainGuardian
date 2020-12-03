import {PublicKey} from "@chainsafe/bls";
import {BLSPubkey} from "@chainsafe/lodestar-types";
import {warn} from "electron-log";
import {IEth1Client} from "../../deposit/ethers";
import {IGenericEth2Client} from "../../eth2/client/interface";
import {ValidatorStatus} from "./statuses";

export * from "./statuses";

export async function getValidatorStatus(
    validatorPubKey: BLSPubkey,
    eth2Api: IGenericEth2Client,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    eth1Api: IEth1Client,
): Promise<ValidatorStatus> {
    if (!(await isBeaconNodeWorking(eth2Api))) {
        return ValidatorStatus.BEACON_ERROR;
    }
    if (!(await hasChainStarted(eth2Api))) {
        return ValidatorStatus.WAITING_START;
    }
    if (await isBeaconNodeSyncing(eth2Api)) {
        return ValidatorStatus.SYNCING;
    }
    const validator = await eth2Api.beacon.state.getValidator("head", validatorPubKey);
    //TODO: convert to our validator
    return (validator.status as unknown) as ValidatorStatus;
}

async function isBeaconNodeWorking(eth2Api: IGenericEth2Client | null): Promise<boolean> {
    if (!eth2Api) return false;
    try {
        await eth2Api.getVersion();
        return true;
    } catch (e) {
        return false;
    }
}

async function hasChainStarted(eth2Api: IGenericEth2Client): Promise<boolean> {
    try {
        return !!(await eth2Api.beacon.getGenesis())?.genesisTime;
    } catch (e) {
        warn("Failed to get genesis time", e);
        return false;
    }
}

async function isBeaconNodeSyncing(eth2Api: IGenericEth2Client): Promise<boolean> {
    try {
        return (await eth2Api.node.getSyncingStatus()).syncDistance === BigInt(0);
    } catch (e) {
        warn("Failed to get syncing status", e);
        return true;
    }
}

async function hasDeposited(pubkey: BLSPubkey, eth1: IEth1Client): Promise<boolean> {
    return await eth1.hasUserDeposited(PublicKey.fromBytes(pubkey as Uint8Array));
}
