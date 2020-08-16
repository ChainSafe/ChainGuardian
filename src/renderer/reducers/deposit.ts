import {DepositAction, DepositActionTypes} from "../actions";

export interface IDepositState {
    waitingForDeposit: boolean;
    isDepositDetected: boolean;
    depositTxData: string;
}

const initialState: IDepositState = {
    waitingForDeposit: false,
    isDepositDetected: false,
    depositTxData: ""
};

export const depositReducer = (state = initialState, action: DepositAction): IDepositState => {
    switch (action.type) {
        case DepositActionTypes.STORE_DEPOSIT_TX_DATA: {
            const txData = action.payload.txData;
            return {
                ...state,
                depositTxData: txData,
            };
        }
        case DepositActionTypes.WAIT_FOR_DEPOSIT: {
            return {
                ...state,
                waitingForDeposit: true
            };
        }
        case DepositActionTypes.DEPOSIT_NOT_FOUND: {
            return {
                ...state,
                waitingForDeposit: false,
                isDepositDetected: false
            };
        }
        case DepositActionTypes.DEPOSIT_DETECTED:
            return {
                ...state,
                isDepositDetected: true,
                waitingForDeposit: false
            };
        default:
            return state;
    }
};
