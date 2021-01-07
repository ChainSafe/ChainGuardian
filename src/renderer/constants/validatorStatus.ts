export enum ValidatorStatus {
    // chain guardian statuses
    NO_BEACON_NODE = "Missing Beacon Node",
    BEACON_NODE_OFFLINE = "Beacon Node Offline",
    SYNCING_BEACON_NODE = "Syncing Beacon Node",
    WAITING_DEPOSIT = "Waiting for a deposit",
    PROCESSING_DEPOSIT = "Processing a deposit",
    // "official" statuses
    DEPOSITED = "Funds deposited",
    QUEUE = "Queue for activation",
    PENDING = "Pending activation",
    ACTIVE = "Active",
    GOOD_BOY_EXITING = "Slashed and exiting",
    SLASHED_EXITING = "Slashed and exiting",
    SLASHED = "Slashed exited",
    VOLUNTARILY_EXITED = "Voluntarily exited",
    WITHDRAWABLE = "Withdrawable",
    WITHDRAWNED = "withdrawned",
    //
    ERROR = "Some error occurred",
}
