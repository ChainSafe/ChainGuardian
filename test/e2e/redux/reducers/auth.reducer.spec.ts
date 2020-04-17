import {setAuth} from "../../../../src/renderer/actions";
import {IAuthState, authReducer as reducer} from "../../../../src/renderer/reducers/auth";
import {AuthActionTypes} from "../../../../src/renderer/constants/action-types";
import {Action} from "redux";
import {CGAccount} from "../../../../src/renderer/models/account";

const account = new CGAccount({
    name: "TestName",
    directory: "/testdirectory/",
    sendStats: false
});

const initalState: IAuthState = {
    account: null,
    validators: [],
};

describe("auth reducer", () => {
    it("should return the initial state", () => {
        expect(reducer(undefined, {} as Action<AuthActionTypes>)).toEqual(
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
