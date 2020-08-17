import {AuthAction, setAuth} from "../../../../src/renderer/actions";
import {authReducer as reducer, IAuthState} from "../../../../src/renderer/reducers/auth";
import {CGAccount} from "../../../../src/renderer/models/account";

const account = new CGAccount({
    name: "TestName",
    directory: "/testdirectory/",
    sendStats: false
});

const initalState: IAuthState = {
    account: null,
};

describe("auth reducer", () => {
    it("should return the initial state", () => {
        expect(reducer(undefined, {} as AuthAction)).toEqual(
            initalState
        );
    });

    it("should handle setAuth", () => {
        expect(
            reducer({} as IAuthState, setAuth(account))
        ).toEqual(
            {
                account
            }
        );
    });

});
