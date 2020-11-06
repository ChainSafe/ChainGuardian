import {IRootState} from "../reducers";
import {networks} from "../../services/eth2/networks";

export const getRegisterSigningVerification = (state: IRootState): boolean => state.register.signingVerification;

export const getRegisterSigningMnemonic = (state: IRootState): string => state.register.signingMnemonic;

export const getRegisterWithdrawalKey = (state: IRootState): string => state.register.withdrawalKey;

export const getRegisterSigningKey = (state: IRootState): string => state.register.signingKey;

export const getRegisterPublicKey = (state: IRootState): string => state.register.publicKey;

export const getRegisterSigningKeyPath = (state: IRootState): string => state.register.signingKeyPath;

export const getRegisterNetwork = (state: IRootState): string => state.register.network;

export const getKeystorePath = (state: IRootState): string | undefined => state.register.path;

export const getNetworkIndex = (state: IRootState): number =>
    state.register.network ? networks.map(n => n.networkName).indexOf(state.register.network) : 0;
