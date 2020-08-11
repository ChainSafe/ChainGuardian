import {
    completeRegistrationSubmission,
    setSigningKey,
    setSigningMnemonic,
    setSigningVerificationStatus
} from "../../../../src/renderer/actions";
import {IRegisterState, registerReducer as reducer} from "../../../../src/renderer/reducers/register";
import {RegisterActionTypes} from "../../../../src/renderer/constants/action-types";
import {Action} from "redux";
import {SupportedNetworks} from "../../../../src/renderer/services/eth2/supportedNetworks";


const privateKeyStr = "0xd68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259";
const expectedMnemonic = "hard caught annual spread green step avocado shine scare warm chronic pond";

const initalState: IRegisterState = {
    signingMnemonic: "",
    signingVerification: false,
    signingKey: "",
    signingKeyPath: "",
    withdrawalKey: "",
    network: SupportedNetworks.LOCALHOST,
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


    it("should handle s", () => {
        expect(
            reducer({
                signingMnemonic: "mock mnemonic",
                signingVerification: false,
                signingKey: "test key",
                signingKeyPath: ""
            } as IRegisterState, completeRegistrationSubmission())
        ).toEqual(
            initalState
        );
    });
});
