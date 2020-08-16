import {networks} from "../services/eth2/networks";
import {RegisterAction, RegisterActionTypes} from "../actions/register";

export interface IRegisterState {
    signingMnemonic: string,
    signingVerification: boolean,
    signingKey: string,
    signingKeyPath: string,
    withdrawalKey: string,
    network: string;
}

const initialState: IRegisterState = {
    signingMnemonic: "",
    signingVerification: false,
    signingKey: "",
    signingKeyPath: "",
    withdrawalKey: "",
    network: networks[0]?.networkName ?? "unknown",
};

export const registerReducer = (state = initialState, action: RegisterAction): IRegisterState => {
    switch (action.type) {
        case RegisterActionTypes.STORE_SIGNING_MNEMONIC:
            return Object.assign({}, state, {
                signingMnemonic: action.payload.signingMnemonic
            });
        case RegisterActionTypes.STORE_SIGNING_VERIFICATION_STATUS:
            return Object.assign({}, state, {
                signingVerification: action.payload.signingVerification
            });
        case RegisterActionTypes.STORE_SIGNING_KEY:
            return Object.assign({}, state, action.payload);

        case RegisterActionTypes.STORE_VALIDATOR_KEYS:
            return Object.assign({}, state, action.payload);

        case RegisterActionTypes.SET_NETWORK:
            return Object.assign({}, state, {
                network: action.payload
            });

        case RegisterActionTypes.COMPLETED_REGISTRATION_SUBMISSION:
            return Object.assign({}, state, initialState);
        default:
            return state;
    }
};
