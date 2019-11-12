import {ADD_MNEMONIC} from "../constants/action-types";

export function addMnemonic (payload: Array<string>): any {
    return {type: ADD_MNEMONIC, payload};
}

// export const storeSigningAction = {mnemonic: string} => (dispatch, getState): void => {
//     dispatch({type: ADD_MNEMONIC, payload: {mnemonic}});
// }