import {testSaga} from "redux-saga-test-plan";
import {authorize} from "../../../../src/renderer/ducks/auth/sagas";
import {storeAuth} from "../../../../src/renderer/ducks/auth/actions";
import {CGAccount} from "../../../../src/renderer/models/account";
import {loadValidatorsAction} from "../../../../src/renderer/ducks/validator/actions";

describe("auth sagas", () => {
    it("authorize saga without user in DB", () => {
        testSaga(authorize).next().next(null).isDone();
    });

    it("authorize saga whit user in DB", () => {
        const account = new CGAccount({
            name: "TestName",
            directory: "/testdirectory/",
            sendStats: false,
        });
        testSaga(authorize)
            .next()
            .next(account)
            .put(storeAuth(account))
            .next()
            .put(loadValidatorsAction())
            .next()
            .isDone();
    });
});
