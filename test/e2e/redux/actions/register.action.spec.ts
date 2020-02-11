import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
    storeSigningKeyAction,
    setSigningKey, setWithdrawalKey,
    storeWithdrawalKeyAction,
    setSigningMnemonic,
    storeSigningMnemonicAction,
    setWithdrawalMnemonic,
    storeWithdrawalMnemonicAction
} from "../../../../src/renderer/actions";
import {IRootState} from "../../../../src/renderer/reducers";
import {IRegisterState} from "../../../../src/renderer/reducers/register";
import {IDepositState} from "../../../../src/renderer/reducers/deposit";
import {IAuthState} from "../../../../src/renderer/reducers/auth";
import {INotificationStateObject} from "../../../../src/renderer/reducers/notification";

const privateKeyStr = "0xd68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259";
const publicKeyStr =
    "0x92fffcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff4990daa18";
const expectedMnemonic = "hard caught annual spread green step avocado shine scare warm chronic pond";

const initialState: IRootState = {
    register: {
        signingKey: privateKeyStr
    } as IRegisterState,
    deposit: {} as IDepositState,
    auth: {} as IAuthState,
    notificationArray: {} as INotificationStateObject
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

    it("should dispatch store withdrawal key action", () => {
        const expectedActions = [
            setWithdrawalKey(publicKeyStr)
        ];
        reduxStore.dispatch<any>(storeWithdrawalKeyAction(publicKeyStr));

        expect(reduxStore.getActions()).toEqual(expectedActions);
    });

    it("should dispatch store signing mnemonic action", () => {
        const expectedActions = [
            setSigningMnemonic(expectedMnemonic)
        ];
        reduxStore.dispatch<any>(storeSigningMnemonicAction(expectedMnemonic));

        expect(reduxStore.getActions()).toEqual(expectedActions);
    });

    it("should dispatch store withdrawal mnemonic action", () => {
        const expectedActions = [
            setWithdrawalMnemonic(expectedMnemonic)
        ];
        reduxStore.dispatch<any>(storeWithdrawalMnemonicAction(expectedMnemonic));

        expect(reduxStore.getActions()).toEqual(expectedActions);
    });
    /*
    it("should dispatch after password action", () => {
        const expectedActions = [
            setClearKeys()
        ];
        reduxStore.dispatch<any>(afterPasswordAction("test"));

        expect(reduxStore.getActions()).toEqual(expectedActions);
    });
    */
});
