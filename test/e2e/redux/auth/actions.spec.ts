import {storeAuth} from "../../../../src/renderer/ducks/auth/actions";
import {CGAccount} from "../../../../src/renderer/models/account";

describe("auth actions", () => {
    it("should return 'storeAuth' action", () => {
        const account = new CGAccount({
            name: "TestName",
            directory: "/testdirectory/",
            sendStats: false,
        });
        expect(storeAuth(account)).toEqual({payload: account, type: "auth/storeAuth"});
    });
});
