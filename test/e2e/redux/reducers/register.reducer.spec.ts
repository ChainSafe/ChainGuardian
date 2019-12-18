
import {
    setSigningKey, 
    setWithdrawalKey, 
    setMnemonic, 
    setClearKeys,
    setFailedVerification
} from "../../../../src/renderer/actions";
import {registerReducer as reducer, IRegisterState} from "../../../../src/renderer/reducers/register";
import {RegisterActionTypes} from "../../../../src/renderer/constants/action-types";
import {Action} from "redux";

const privateKeyStr = "0xd68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259";
const publicKeyStr =
    "0x92fffcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff4990daa18";
const expectedMnemonic = "hard caught annual spread green step avocado shine scare warm chronic pond";

const initalState: IRegisterState = {
    mnemonic: "",
    signingKey: "",
    withdrawalKey: "",
    failedVerification: false
};

describe("register reducer", () => {
    it("should return the initial state", () => {
        expect(reducer(undefined, {} as Action<RegisterActionTypes>)).toEqual(
            initalState
        );
    });

    it("should handle setSigningKey", () => {
        expect(
            reducer({} as IRegisterState, setSigningKey(privateKeyStr))
        ).toEqual(
            {
                signingKey: privateKeyStr
            }
        );
    });

    it("should handle setWithdrawalKey", () => {
        expect(
            reducer({} as IRegisterState, setWithdrawalKey(publicKeyStr))
        ).toEqual(
            {
                withdrawalKey: publicKeyStr
            }
        );
    });

    it("should handle setMnemonic", () => {
        expect(
            reducer({} as IRegisterState, setMnemonic(expectedMnemonic))
        ).toEqual(
            {
                mnemonic: expectedMnemonic
            }
        );
    });

    it("should handle setFailedVerification", () => {
        expect(
            reducer({} as IRegisterState, setFailedVerification(true))
        ).toEqual(
            {
                failedVerification: true
            }
        );
    });

    it("should handle s", () => {
        expect(
            reducer({
                signingKey: "test key",
                withdrawalKey: "test key",
                mnemonic: "mock mnemonic",
                failedVerification: false
            } as IRegisterState, setClearKeys())
        ).toEqual(
            initalState
        );
    });
});