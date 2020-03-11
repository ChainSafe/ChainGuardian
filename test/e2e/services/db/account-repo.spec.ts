import {CGDatabase} from "../../../../src/renderer/services/db/api";
import {CGAccount} from "../../../../src/renderer/models/account";
import { destroyDb, getLevelDbController } from './utils';

describe("Account Repository Test", () => {
    let database: CGDatabase, controller;

    const db = getLevelDbController();
    const testId = "id";

    beforeAll(async () => {
        await db.start();
    });

    afterAll(async () => {
        await db.stop();
        await destroyDb();
    });

    beforeEach(() => {
        controller = db;
        database = new CGDatabase({controller});
    });

    afterEach(() => {
        database.account.delete(testId);
    });

    it("should save account to the db", async () => {
        const account = new CGAccount({
            name: "TestAcc",
            directory: "./",
            sendStats: false
        });

        await database.account.set(testId, account);

    });

    it("should be able to get the account from db", async () => {
        const account = new CGAccount({
            name: "TestAcc",
            directory: "./",
            sendStats: false
        });

        await database.account.set(testId, account);

        const fetchedAccount: CGAccount | null = await database.account.get(testId);

        expect(fetchedAccount).not.toEqual(null);

        if(fetchedAccount){
            expect(fetchedAccount.name).toEqual(account.name);
            expect(fetchedAccount.directory).toEqual(account.directory);
            expect(fetchedAccount.sendStats).toEqual(account.sendStats);
        }
    });
});
