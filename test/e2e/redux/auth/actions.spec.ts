import {requireAuthorization, storeAuth} from "../../../../src/renderer/ducks/auth/actions";
import {CGAccount} from "../../../../src/renderer/models/account";
import {DEFAULT_ACCOUNT} from "../../../../src/renderer/constants/account";

describe("auth actions", () => {
    it("should return 'storeAuth' action", () => {
        const account = new CGAccount({
            name: "TestName",
            directory: "/testdirectory/",
            sendStats: false,
        });
        expect(storeAuth(account)).toEqual({payload: account, type: "auth/storeAuth"});
    });

    describe("'requireAuthorization' action", () => {
        it("should return whit default payload", () => {
            expect(requireAuthorization()).toEqual({payload: DEFAULT_ACCOUNT, type: "auth/requireAuthorization"});
        });

        it("should return whit entered param", () => {
            expect(requireAuthorization("superUser")).toEqual({
                payload: "superUser",
                type: "auth/requireAuthorization",
            });
        });
    });
});
