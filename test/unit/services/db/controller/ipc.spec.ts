import {expect} from "chai";
import {intToBytes} from "@chainsafe/lodestar-utils";
import {IpcMainEvent, IpcMainInvokeEvent} from "electron";
// @ts-ignore
import {IpcDatabaseController} from "./../../../../../src/renderer/services/db/controller/ipc";
import {ipcMain} from "../../../../../mocks/electronMock";
import {IpcDatabaseEvents} from "../../../../../src/main/db/events";

describe("Ipc communication pipe", () => {
    const db = new IpcDatabaseController();

    it("test put", async (done) => {
        db.put(Buffer.from("key0"), Buffer.from("value"));

        ipcMain.once(IpcDatabaseEvents.DATABASE_PUT, (_: IpcMainEvent, data: Buffer[]) => {
            expect(data).to.be.deep.equal(Buffer.from("key0"));
            done();
        });
    });

    it("test batch put", async () => {
        db.batchPut([
            {
                key: Buffer.from("key1"),
                value: Buffer.from("value"),
            },
            {
                key: Buffer.from("key2"),
                value: Buffer.from("value"),
            },
        ]);

        ipcMain.once(IpcDatabaseEvents.DATABASE_BATCH_PUT, (_: IpcMainEvent, data: Buffer[]) => {
            expect(data).to.be.deep.equal([
                {
                    key: Buffer.from("key1"),
                    value: Buffer.from("value"),
                },
                {
                    key: Buffer.from("key2"),
                    value: Buffer.from("value"),
                },
            ]);
        });
    });

    it("test get", async (done) => {
        db.put(Buffer.from("key1"), Buffer.from("value"));
        db.get(Buffer.from("key1"));

        ipcMain.once(IpcDatabaseEvents.DATABASE_GET, (_: IpcMainEvent, data: Buffer[]) => {
            expect(data).to.be.deep.equal(Buffer.from("key1"));
            done();
        });
    });

    it("test search", async (done) => {
        db.batchPut([
            {
                key: intToBytes(1, 4),
                value: Buffer.from("value"),
            },
            {
                key: intToBytes(2, 4),
                value: Buffer.from("value"),
            },
        ]);

        db.search({
            gt: intToBytes(0, 4),
            lt: intToBytes(99, 4),
        });

        ipcMain.handle(IpcDatabaseEvents.DATABASE_SEARCH, (_: IpcMainInvokeEvent, data: Buffer[]) => {
            expect(data).to.be.deep.equal({
                gt: intToBytes(0, 4),
                lt: intToBytes(99, 4),
            });
            done();
        });
    });

    it("test delete", async (done) => {
        db.batchPut([
            {
                key: Buffer.from("key1"),
                value: Buffer.from("value"),
            },
            {
                key: Buffer.from("key2"),
                value: Buffer.from("value"),
            },
        ]);

        db.delete(Buffer.from("key1"));

        ipcMain.once(IpcDatabaseEvents.DATABASE_DELETE, (_: IpcMainEvent, data: Buffer[]) => {
            expect(data).to.be.deep.equal(Buffer.from("key1"));
            done();
        });
    });

    it("test keys", async (done) => {
        db.batchPut([
            {
                key: Buffer.from("key1"),
                value: Buffer.from("value"),
            },
            {
                key: Buffer.from("key2"),
                value: Buffer.from("value"),
            },
        ]);

        db.keys({
            gt: Buffer.from("key0"),
            lt: Buffer.from("key99"),
        });

        ipcMain.once(IpcDatabaseEvents.DATABASE_KEYS, (_: IpcMainEvent, data: Buffer[]) => {
            expect(data).to.be.deep.equal({
                gt: Buffer.from("key0"),
                lt: Buffer.from("key99"),
            });
            done();
        });
    });

    it("test values", async (done) => {
        db.batchPut([
            {
                key: Buffer.from("key1"),
                value: Buffer.from("value"),
            },
            {
                key: Buffer.from("key2"),
                value: Buffer.from("value"),
            },
        ]);

        db.values({
            gt: Buffer.from("key0"),
            lt: Buffer.from("key99"),
        });

        ipcMain.once(IpcDatabaseEvents.DATABASE_VALUES, async (_: IpcMainEvent, data: Buffer[]) => {
            expect(data).to.be.deep.equal({
                gt: Buffer.from("key0"),
                lt: Buffer.from("key99"),
            });
            done();
        });
    });
});
