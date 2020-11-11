import {assert, expect} from "chai";
// @ts-ignore
import level from "level";
import leveldown from "leveldown";
import {promisify} from "util";
import {LevelDbController} from "../../../../src/main/db/controller";

describe("LevelDB controller", () => {
    const dbLocation = "./.__testdb";
    const testDb = level(dbLocation, {
        keyEncoding: "binary",
        valueEncoding: "binary",
    });
    const db = new LevelDbController({db: testDb, location: dbLocation});

    beforeAll(async () => {
        await db.start();
    });

    afterAll(async () => {
        await db.stop();
        const lvldown = new leveldown(dbLocation);
        await promisify(lvldown.destroy)(dbLocation);
    });

    it("test put", async () => {
        await db.put("test", "some value");
        assert(true);
    });

    it("test get", async () => {
        await db.put("test1", "some value");
        const value = await db.get("test1");
        // @ts-ignore
        expect(value.toString("utf8")).to.be.equal("some value");
    });

    it("test get not found", async () => {
        const value = await db.get("invalidKey");
        expect(value).to.be.null;
    });

    it("test batchPut", async () => {
        await db.batchPut([
            {
                key: "test3",
                value: "value",
            },
            {
                key: "test3",
                value: "value",
            },
        ]);
        expect(true);
    });

    it("test search", async () => {
        await db.batchPut([
            {
                key: "key1",
                value: "value",
            },
            {
                key: "key2",
                value: "value",
            },
        ]);
        const result = await db.search({
            gt: "key0",
            lt: "key99",
        });
        expect(result.length).to.be.equal(2);
    });

    it("test batch delete", async () => {
        await db.batchPut([
            {
                key: "key1",
                value: "value",
            },
            {
                key: "key2",
                value: "value",
            },
        ]);
        const result = await db.search({
            gt: "key0",
            lt: "key99",
        });
        expect(result.length).to.be.equal(2);
        await db.batchDelete(["key1", "key2"]);
    });
});
