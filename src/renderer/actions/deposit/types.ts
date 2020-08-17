

export enum DepositActionTypes {
    WAIT_FOR_DEPOSIT = "WAIT_FOR_DEPOSIT",
    DEPOSIT_NOT_FOUND = "DEPOSIT_NOT_FOUND",
    STORE_DEPOSIT_TX_DATA = "STORE_DEPOSIT_TX_DATA",
    DEPOSIT_DETECTED = "DEPOSIT_DETECTED",
    RESET_DEPOSIT_DATA = "RESET_DEPOSIT_DATA"
}

export type GenerateDepositPayload = {
    txData: string;
};

export type GenerateDepositAction = {
    type: typeof DepositActionTypes.STORE_DEPOSIT_TX_DATA
    payload: GenerateDepositPayload;
};

export type WaitForDepositAction = {
    type: typeof DepositActionTypes.WAIT_FOR_DEPOSIT
};
export type DepositDetectionAction = {
    type: typeof DepositActionTypes.DEPOSIT_DETECTED
};
export type DepositNotFoundAction = {
    type: typeof DepositActionTypes.DEPOSIT_NOT_FOUND
};
export type ResetDepositDataAction = {
    type: typeof DepositActionTypes.RESET_DEPOSIT_DATA
};

export type DepositAction =
    GenerateDepositAction
    | WaitForDepositAction
    | DepositDetectionAction
    | DepositNotFoundAction
    | ResetDepositDataAction;
