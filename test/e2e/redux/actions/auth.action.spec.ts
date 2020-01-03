import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import {setAuth, storeAuthAction} from "../../../../src/renderer/actions";
import {IRootState} from "../../../../src/renderer/reducers";
import {IRegisterState} from "../../../../src/renderer/reducers/register";
import {IDepositState} from "../../../../src/renderer/reducers/deposit";
import {IAuthState} from "../../../../src/renderer/reducers/auth";
import {CGAccount} from "../../../../src/renderer/models/account";

const account = new CGAccount({
    name: "TestName",
    directory: "/testdirectory/",
    sendStats: false
});
const initialState: IRootState = {
    register: {} as IRegisterState,
    deposit: {} as IDepositState,
    auth: {} as IAuthState
};

describe("auth actions", () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const reduxStore = mockStore(initialState);

    beforeEach(() => {
        reduxStore.clearActions();
    });

    it("should dispatch store auth action", () => {
        const expectedActions = [
            setAuth(account)
        ];
        reduxStore.dispatch<any>(storeAuthAction(account));

        expect(reduxStore.getActions()).toEqual(expectedActions);
    });

});
