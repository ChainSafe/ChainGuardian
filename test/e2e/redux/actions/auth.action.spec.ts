import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import sinon from "sinon";

import {loadAccountAction, setAuth} from "../../../../src/renderer/actions";
import {IRootState} from "../../../../src/renderer/reducers";
import {IRegisterState} from "../../../../src/renderer/reducers/register";
import {IDepositState} from "../../../../src/renderer/reducers/deposit";
import {IAuthState} from "../../../../src/renderer/reducers/auth";
import {INotificationStateObject} from "../../../../src/renderer/reducers/notification";
import {CGAccount} from "../../../../src/renderer/models/account";
import {INetworkState} from "../../../../src/renderer/reducers/network";
import {IValidatorState} from "../../../../src/renderer/reducers/validators";
import database from "../../../../src/renderer/services/db/api/database";

const account = new CGAccount({
    name: "TestName",
    directory: "/testdirectory/",
    sendStats: false
});
const initialState: IRootState = {
    register: {} as IRegisterState,
    deposit: {} as IDepositState,
    auth: {} as IAuthState,
    notificationArray: {} as INotificationStateObject,
    network: {} as INetworkState,
    validators: {} as IValidatorState,
};

describe("auth actions", () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const reduxStore = mockStore(initialState);
    let dbSandbox: sinon.SinonSandbox;

    beforeEach(() => {
        reduxStore.clearActions();
        dbSandbox = sinon.createSandbox();
    });

    afterEach(function () {
        dbSandbox.restore();
    });

    it("should dispatch store auth action if account exists", async () => {
        dbSandbox.stub(database.account, "get").resolves(account);
        const expectedActions = [
            setAuth(account)
        ];
        await reduxStore.dispatch<any>(loadAccountAction());

        expect(reduxStore.getActions()).toEqual(expectedActions);
    });

    it("should not dispatch store auth action if account not found", () => {
        dbSandbox.stub(database.account, "get").resolves(null);
        reduxStore.dispatch<any>(loadAccountAction());

        expect(reduxStore.getActions()).toEqual([]);
    });
});
