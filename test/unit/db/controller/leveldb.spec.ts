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
            gt: Buffer.from("key0"),
            lt: Buffer.from("key99"),
        });
        expect(result.length).to.be.equal(2);
    });

    it("test delete", async () => {
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
            gt: Buffer.from("key0"),
            lt: Buffer.from("key99"),
        });
        expect(result.length).to.be.equal(2);

        await db.delete("key1");
        const resultAfterDelete = await db.search({
            gt: Buffer.from("key0"),
            lt: Buffer.from("key99"),
        });
        expect(resultAfterDelete.length).to.be.deep.equal(1);
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
            gt: Buffer.from("key0"),
            lt: Buffer.from("key99"),
        });
        expect(result.length).to.be.equal(2);

        await db.batchDelete(["key1", "key2"]);
        const resultAfterDelete = await db.search({
            gt: Buffer.from("key0"),
            lt: Buffer.from("key99"),
        });
        expect(resultAfterDelete).to.be.deep.equal([]);
    });

    it("test keys stream", async () => {
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
        const result = await db.keysStream({
            gt: Buffer.from("key0"),
            lt: Buffer.from("key99"),
        });

        for await (const buffer of result) {
            expect(buffer).to.be.instanceOf(Buffer);
            expect(buffer.length).not.to.be.deep.equal(0);
        }
    });

    it("test keys", async () => {
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

        const result = await db.keys({
            gt: Buffer.from("key0"),
            lt: Buffer.from("key99"),
        });
        expect(result).to.be.deep.equal([Buffer.from("key1"), Buffer.from("key2")]);
    });

    it("test values stream", async () => {
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
        const result = await db.valuesStream({
            gt: Buffer.from("key0"),
            lt: Buffer.from("key99"),
        });

        for await (const buffer of result) {
            expect(buffer).to.be.instanceOf(Buffer);
            expect(buffer.length).not.to.be.deep.equal(0);
        }
    });

    it("test values", async () => {
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

        const result = await db.values({
            gt: Buffer.from("key0"),
            lt: Buffer.from("key99"),
        });
        expect(result).to.be.deep.equal([Buffer.from("value"), Buffer.from("value")]);
    });
});
