import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
    storeSigningKeyAction,
    setSigningKey,
    setSigningMnemonic,
    storeSigningMnemonicAction,
} from "../../../../src/renderer/actions";
import {IRootState} from "../../../../src/renderer/reducers";
import {IRegisterState} from "../../../../src/renderer/reducers/register";
import {IDepositState} from "../../../../src/renderer/reducers/deposit";
import {IAuthState} from "../../../../src/renderer/reducers/auth";
import {INotificationStateObject} from "../../../../src/renderer/reducers/notification";
import {INetworkState} from "../../../../src/renderer/reducers/network";
import {IValidatorState} from "../../../../src/renderer/reducers/validators";

const privateKeyStr = "0xd68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259";
const expectedMnemonic = "hard caught annual spread green step avocado shine scare warm chronic pond";

export const initialState: IRootState = {
    register: {
        signingKey: privateKeyStr
    } as IRegisterState,
    deposit: {} as IDepositState,
    auth: {} as IAuthState,
    notificationArray: {} as INotificationStateObject,
    network: {} as INetworkState,
    validators: {} as IValidatorState,
};


describe("register actions", () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const reduxStore = mockStore(initialState);

    beforeEach(() => {
        reduxStore.clearActions();
    });

    it("should dispatch store signing key action", () => {
        const expectedActions = [
            setSigningKey(privateKeyStr)
        ];
        reduxStore.dispatch<any>(storeSigningKeyAction(privateKeyStr));

        expect(reduxStore.getActions()).toEqual(expectedActions);
    });


    it("should dispatch store signing mnemonic action", () => {
        const expectedActions = [
            setSigningMnemonic(expectedMnemonic)
        ];
        reduxStore.dispatch<any>(storeSigningMnemonicAction(expectedMnemonic));

        expect(reduxStore.getActions()).toEqual(expectedActions);
    });

});
