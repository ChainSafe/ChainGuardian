import {ADD_MNEMONIC} from "../constants/action-types";

export function addMnemonic (payload: Array<string>): object {
    return {type: ADD_MNEMONIC, payload};
}