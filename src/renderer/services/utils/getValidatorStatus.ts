import {ValidatorStatus} from "../../constants/validatorStatus";
import logger from "electron-log";
import {readBeaconChainNetwork, getBeaconNodeEth2ApiClient} from "../eth2/client/module";

export const getValidatorStatus = async (publicKey: string, beaconNodeUrl?: string): Promise<ValidatorStatus> => {
    if (!beaconNodeUrl) return ValidatorStatus.NO_BEACON_NODE;

    const config = await readBeaconChainNetwork(beaconNodeUrl);
    if (!config) return ValidatorStatus.BEACON_NODE_OFFLINE;

    const ApiClient = await getBeaconNodeEth2ApiClient(beaconNodeUrl);
    const client = new ApiClient(config?.eth2Config, beaconNodeUrl);

    const stateValidator = await client.beacon.getStateValidator("head", publicKey);

    if (!stateValidator || (stateValidator.data.status as string) === "unknown") {
        // // TODO: experiment to see best
        // const currentBlock = await config.eth1Provider.getBlockNumber();
        // const logs = await config.eth1Provider.getLogs({
        //     address: config.contract.address,
        //     fromBlock: currentBlock - 6144, // approx 24h before current block
        //     topics: [ethers.utils.id("DepositEvent(bytes,bytes,bytes,bytes,bytes)")],
        // });
        // const containsThisValidator = logs.some(({data}) => data.includes(publicKey.substr(2)));

        return ValidatorStatus.PENDING_DEPOSIT_OR_ACTIVATION;
    } else {
        return getValidatorStatusFromString(stateValidator.data.status);
    }
};

const getValidatorStatusFromString = (status: string): ValidatorStatus => {
    /** LIGHTHOUSE statuses based on v2 https://hackmd.io/bQxMDRt1RbS1TLno8K4NPg#Validator-Status
     * "unknown"
     * "waiting_for_eligibility"
     * "waiting_for_finality"
     * "waiting_in_queue"
     * "standby_for_active"
     * "active"
     * "active_awaiting_voluntary_exit"
     * "active_awaiting_slashed_exit"
     * "exited_voluntarily"
     * "exited_slashed"
     * "withdrawable"
     * "withdrawn"
     */
    /** V1 spec https://hackmd.io/ofFJ5gOmQpu1jjHilHbdQQ
     * "pending"
     * - "pending_initialized"
     * - "pending_queued"
     * "active"
     * - "active_ongoing"
     * - "active_exiting"
     * - "active_slashed"
     * "exited"
     * - "exited_unslashed"
     * - "exited_slashed"
     * "withdrawal"
     * - "withdrawal_possible"
     * - "withdrawal_done"
     */
    /** PRYSM -.-
     * "PENDING_INITIALIZED"
     * "PENDING_QUEUED"
     * "ACTIVE_ONGOING"
     * "ACTIVE_EXITING"
     * "ACTIVE_SLASHED"
     * "EXITED_UNSLASHED"
     * "EXITED_SLASHED"
     * "WITHDRAWAL_POSSIBLE"
     * "WITHDRAWAL_DONE"
     * "ACTIVE"
     * "PENDING"
     * "EXITED"
     */

    // TODO: implement v1 spec
    switch (status) {
        case "waiting_for_eligibility":
            return ValidatorStatus.PROCESSING_DEPOSIT;
        case "waiting_for_finality":
            return ValidatorStatus.DEPOSITED;
        case "waiting_in_queue":
        case "pending_initialized":
        case "PENDING_INITIALIZED":
            return ValidatorStatus.QUEUE;
        case "standby_for_active":
        case "pending_queued":
        case "PENDING":
        case "PENDING_QUEUED":
            return ValidatorStatus.PENDING;
        case "active":
        case "active_ongoing":
        case "ACTIVE":
        case "ACTIVE_ONGOING":
            return ValidatorStatus.ACTIVE;
        case "active_awaiting_voluntary_exit":
        case "active_exiting":
        case "ACTIVE_EXITING":
            return ValidatorStatus.GOOD_BOY_EXITING;
        case "active_awaiting_slashed_exit":
        case "active_slashed":
        case "ACTIVE_SLASHED":
            return ValidatorStatus.SLASHED_EXITING;
        case "exited_voluntarily":
        case "exited_unslashed":
        case "EXITED":
        case "EXITED_UNSLASHED":
            return ValidatorStatus.VOLUNTARILY_EXITED;
        case "exited_slashed":
        case "EXITED_SLASHED":
            return ValidatorStatus.SLASHED;
        case "withdrawable":
        case "withdrawal_possible":
        case "WITHDRAWAL_POSSIBLE":
            return ValidatorStatus.WITHDRAWABLE;
        case "withdrawn":
        case "withdrawal_done":
        case "WITHDRAWAL_DONE":
            return ValidatorStatus.WITHDRAWNED;
        default:
            logger.error(`Status: "${status}" not found`);
            return ValidatorStatus.ERROR;
    }
};
