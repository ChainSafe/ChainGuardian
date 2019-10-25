import {CGDatabase} from "../../../../src/renderer/services/db/api";
import {LevelDbController} from "../../../../src/renderer/services/db";
import {config} from "@chainsafe/eth2.0-config/lib/presets/mainnet";
import {CGAccount} from "../../../../src/renderer/models/account";
// @ts-ignore
import level from "level";
import {promisify} from "util";
import leveldown from "leveldown";

describe("Account Repository Test", () => {
    let database: CGDatabase, controller;

    const dbLocation = "./.__testdb";
    const testDb = level(dbLocation, {
        keyEncoding: "binary",
        valueEncoding: "binary"
    });
    const db = new LevelDbController({db: testDb, name: dbLocation});
    const testId = "id";

    beforeAll(async () => {
        await db.start();
    });

    afterAll(async () => {
        await db.stop();
        await promisify(new leveldown(dbLocation).destroy)(dbLocation);
    });

    beforeEach(() => {
        controller = db;
        database = new CGDatabase({controller, config});
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

        database.account.set(testId, account);

        const fetchedAccount: CGAccount | null = await database.account.get(testId);

        expect(fetchedAccount).not.toEqual(null);

        if(fetchedAccount){
            expect(fetchedAccount.name).toEqual(account.name);
            expect(fetchedAccount.directory).toEqual(account.directory);
            expect(fetchedAccount.sendStats).toEqual(account.sendStats);
        }
    });
});
