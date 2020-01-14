import {setAuth,setPassword} from "../../../../src/renderer/actions/auth";
import {IAuthState, authReducer as reducer} from "../../../../src/renderer/reducers/auth";
import {AuthActionTypes} from "../../../../src/renderer/constants/action-types";
import {Action} from "redux";
import {CGAccount} from "../../../../src/renderer/models/account";

const account = new CGAccount({
    name: "TestName",
    directory: "/testdirectory/",
    sendStats: false
});
const mockPassword = "!Q1q1q";
const initalState: IAuthState = {
    auth: null,
    password: ""
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
                auth: account
            }
        );
    });

    it("should handle setPassword", () => {
        expect(
            reducer({} as IAuthState, setPassword(mockPassword))
        ).toEqual(
            {
                password: mockPassword
            }
        );
    });

});