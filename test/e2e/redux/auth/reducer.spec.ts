import {authSlice, IAuthState} from "../../../../src/renderer/ducks/auth/slice";
import {storeAuth} from "../../../../src/renderer/ducks/auth/actions";
import {CGAccount} from "../../../../src/renderer/models/account";

const initialState: IAuthState = {account: null};

describe("auth reducer", () => {
    it("should not change store", () => {
        expect(authSlice.reducer(initialState, {type: "random"})).toEqual(initialState);
    });

    it("should update account", () => {
        const account = new CGAccount({
            name: "TestName",
            directory: "/testdirectory/",
            sendStats: false,
        });
        expect(authSlice.reducer(initialState, storeAuth(account))).toEqual({account});
    });
});
