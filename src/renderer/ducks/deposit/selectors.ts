import {IRootState} from "../reducers";

export const getWaitingForDeposit = (state: IRootState): boolean => state.deposit.waitingForDeposit;

export const getDepositTxData = (state: IRootState): string => state.deposit.depositTxData;

export const getIsDepositDetected = (state: IRootState): boolean => state.deposit.isDepositDetected;
