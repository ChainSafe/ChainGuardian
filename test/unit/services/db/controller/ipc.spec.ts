import {IFilterOptions} from "@chainsafe/lodestar-db";
import sinon from "sinon";
import {LevelDbController} from "../../../../../src/main/db/controller/impl/level";
import {DatabaseIpcHandler} from "../../../../../src/main/db/ipc";
import {collect} from "../../../utils/iterable";
import {IpcDatabaseController} from "./../../../../../src/renderer/services/db/controller/ipc";

describe("Ipc communication pipe", () => {
    jest.setTimeout(300);

    const levelDbMock = sinon.createStubInstance(LevelDbController);
    let rendererDbService: IpcDatabaseController;
    let mainDbIpcHandler: DatabaseIpcHandler;

    beforeEach(async function () {
        rendererDbService = new IpcDatabaseController();
        mainDbIpcHandler = new DatabaseIpcHandler();
        await mainDbIpcHandler.start((levelDbMock as unknown) as LevelDbController);
    });

    afterEach(async function () {
        await mainDbIpcHandler.stop();
    });

    it("put", async () => {
        const key = Buffer.from("key0");
        const value = Buffer.from("value");
        const promise = new Promise((resolve) => {
            levelDbMock.put.callsFake(() => {
                resolve();
                return null;
            });
        });
        await rendererDbService.put(key, value);
        await promise;
        expect(levelDbMock.put.calledOnceWith(key, value)).toBeTruthy();
    });

    it("batch put", async () => {
        const promise = new Promise((resolve) => {
            levelDbMock.batchPut.callsFake(() => {
                resolve();
                return null;
            });
        });
        const data = [
            {
                key: Buffer.from("key1"),
                value: Buffer.from("value"),
            },
            {
                key: Buffer.from("key2"),
                value: Buffer.from("value"),
            },
        ];
        rendererDbService.batchPut(data);
        await promise;
        expect(levelDbMock.batchPut.calledOnceWith(data)).toBeTruthy();
    });

    it("get", async () => {
        const value = Buffer.from("test");
        levelDbMock.get.callsFake(async () => {
            return value;
        });
        const key = Buffer.from("key0");
        const result = await rendererDbService.get(key);
        expect(result).toEqual(value);
    });

    it("search", async () => {
        const searchParams: IFilterOptions<Buffer> = {
            gt: Buffer.from("key1"),
            lt: Buffer.from("value"),
        };
        const value = Buffer.from("test");
        const data = [value, value];
        levelDbMock.search.callsFake(async () => {
            return data;
        });
        const result = await rendererDbService.search(searchParams);
        expect(result).toEqual(data);
        expect(levelDbMock.search.calledOnceWithExactly(searchParams));
    });

    it("delete", async () => {
        const key = Buffer.from("key0");
        const promise = new Promise((resolve) => {
            levelDbMock.delete.callsFake(async () => {
                resolve();
            });
        });
        await rendererDbService.delete(key);
        await promise;
        expect(levelDbMock.delete.calledOnceWith(key)).toBeTruthy();
    });

    it("keys", async () => {
        const searchParams: IFilterOptions<Buffer> = {
            gt: Buffer.from("key1"),
            lt: Buffer.from("value"),
        };
        const key = Buffer.from("test");
        const data = [key, key];
        levelDbMock.keys.callsFake(async () => {
            return data;
        });
        const result = await rendererDbService.keys(searchParams);
        expect(result).toEqual(data);
        expect(levelDbMock.keys.calledOnceWithExactly(searchParams));
    });

    it("values", async () => {
        const searchParams: IFilterOptions<Buffer> = {
            gt: Buffer.from("key1"),
            lt: Buffer.from("value"),
        };
        const value = Buffer.from("test");
        const data = [value, value];
        levelDbMock.values.callsFake(async () => {
            return data;
        });
        const result = await rendererDbService.values(searchParams);
        expect(result).toEqual(data);
        expect(levelDbMock.values.calledOnceWithExactly(searchParams));
    });

    it("value stream", async () => {
        const value = Buffer.from("test");
        const data = [value, value];
        levelDbMock.valuesStream.callsFake(() => {
            return (async function* (): AsyncIterable<Buffer> {
                for (const value of data) {
                    yield value;
                }
            })();
        });
        const result = await collect(rendererDbService.valuesStream());
        expect(result).toEqual(data);
    });
});
