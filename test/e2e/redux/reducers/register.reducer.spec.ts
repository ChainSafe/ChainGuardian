
import {
    setSigningKey, 
    setWithdrawalKey, 
    setSigningMnemonic,
    setSigningVerificationStatus,
    setWithdrawalMnemonic,
    setWithdrawalVerificationStatus,
    completeRegistrationSubmission
} from "../../../../src/renderer/actions";
import {IRegisterState, registerReducer as reducer} from "../../../../src/renderer/reducers/register";
import {RegisterActionTypes} from "../../../../src/renderer/constants/action-types";
import {Action} from "redux";

const privateKeyStr = "0xd68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259";
const publicKeyStr =
    "0x92fffcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff4990daa18";
const expectedMnemonic = "hard caught annual spread green step avocado shine scare warm chronic pond";

const initalState: IRegisterState = {
    signingMnemonic: "",
    signingVerification: false,
    signingKey: "",
    withdrawalMnemonic: "",
    withdrawalVerification: false,
    withdrawalKey: "",
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

    it("should handle setSigningMnemonic", () => {
        expect(
            reducer({} as IRegisterState, setSigningMnemonic(expectedMnemonic))
        ).toEqual(
            {
                signingMnemonic: expectedMnemonic
            }
        );
    });

    it("should handle setSigningVerificationStatus", () => {
        expect(
            reducer({} as IRegisterState, setSigningVerificationStatus(true))
        ).toEqual(
            {
                signingVerification: true
            }
        );
    });

    it("should handle setWithdrawalMnemonic", () => {
        expect(
            reducer({} as IRegisterState, setWithdrawalMnemonic(expectedMnemonic))
        ).toEqual(
            {
                withdrawalMnemonic: expectedMnemonic
            }
        );
    });

    it("should handle setWithdrawalVerificationStatus", () => {
        expect(
            reducer({} as IRegisterState, setWithdrawalVerificationStatus(true))
        ).toEqual(
            {
                withdrawalVerification: true
            }
        );
    });

    it("should handle s", () => {
        expect(
            reducer({
                signingMnemonic: "mock mnemonic",
                signingVerification: false,
                signingKey: "test key",
                withdrawalMnemonic: "mock mnemonic",
                withdrawalVerification: false,
                withdrawalKey: "test key",
            } as IRegisterState, completeRegistrationSubmission())
        ).toEqual(
            initalState
        );
    });
});