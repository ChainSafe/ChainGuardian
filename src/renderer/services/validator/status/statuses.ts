export enum ValidatorStatus {
    BEACON_ERROR = "Beacon node missing or not working.",
    WAITING_START = "Waiting for chain to start...",
    SYNCING = "Beacon node syncing...",
    WAITING_DEPOSIT = "Waiting for deposit...",
    ACTIVATION_QUEUE = "In activation queue",
    ACTIVE = "Active",
    SLASHED = "Slashed",
    EXIT_QUEUE = "Waiting exit queue...",
    EXITED = "Exited",
}
