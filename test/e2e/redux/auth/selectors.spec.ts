import {getAuthAccount} from "../../../../src/renderer/ducks/auth/selectors";
import {IAuthState} from "../../../../src/renderer/ducks/auth/slice";
import {IRootState} from "../../../../src/renderer/ducks/reducers";
import {CGAccount} from "../../../../src/renderer/models/account";

const initialState: IAuthState = {account: null};

const initialRootState = {
    auth: initialState,
} as IRootState;

describe("auth selectors", () => {
    describe("'getAuthAccount' selector", () => {
        it("should return default", () => {
            expect(getAuthAccount(initialRootState)).toBeNull();
        });

        it("should return account", () => {
            const populatedState = {...initialRootState};
            const account = new CGAccount({
                name: "TestName",
                directory: "/testdirectory/",
                sendStats: false,
            });
            populatedState.auth.account = account;
            expect(getAuthAccount(populatedState)).toEqual(account);
        });
    });
});
