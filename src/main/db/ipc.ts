import {IFilterOptions, IKeyValue} from "@chainsafe/lodestar-db";
import {ipcMain, IpcMainEvent, IpcMainInvokeEvent} from "electron";
import {getConfig} from "../../config/config";
import {IService} from "../../renderer/services/interfaces";
import {LevelDbController} from "./controller";
import {IpcDatabaseEvents} from "./events";

export class DatabaseIpcHandler implements IService {
    private database!: LevelDbController;

    public async start(db?: LevelDbController): Promise<void> {
        this.database =
            db ??
            new LevelDbController({
                location: getConfig().db.name,
            });
        await this.database.start();
        ipcMain.handle(IpcDatabaseEvents.DATABASE_GET, this.handleGet);
        ipcMain.on(IpcDatabaseEvents.DATABASE_PUT, this.handlePut);
        ipcMain.on(IpcDatabaseEvents.DATABASE_DELETE, this.handleDelete);
        ipcMain.handle(IpcDatabaseEvents.DATABASE_SEARCH, this.handleSearch);
        ipcMain.on(IpcDatabaseEvents.DATABASE_BATCH_PUT, this.handleBatchPut);
        ipcMain.handle(IpcDatabaseEvents.DATABASE_KEYS, this.handleKeys);
        ipcMain.handle(IpcDatabaseEvents.DATABASE_VALUES, this.handleValues);
        ipcMain.on(IpcDatabaseEvents.DATABASE_VALUES_STREAM, this.handleValuesStream);
    }

    public async stop(): Promise<void> {
        ipcMain.removeHandler(IpcDatabaseEvents.DATABASE_GET);
        ipcMain.removeListener(IpcDatabaseEvents.DATABASE_PUT, this.handlePut);
        ipcMain.removeListener(IpcDatabaseEvents.DATABASE_DELETE, this.handleDelete);
        ipcMain.removeHandler(IpcDatabaseEvents.DATABASE_SEARCH);
        ipcMain.removeListener(IpcDatabaseEvents.DATABASE_BATCH_PUT, this.handleBatchPut);
        ipcMain.removeHandler(IpcDatabaseEvents.DATABASE_KEYS);
        ipcMain.removeHandler(IpcDatabaseEvents.DATABASE_VALUES);
        ipcMain.removeListener(IpcDatabaseEvents.DATABASE_VALUES_STREAM, this.handleValuesStream);
        await this.database.stop();
    }

    private handleGet = async (event: IpcMainInvokeEvent, key: string | Buffer): Promise<Buffer | null> => {
        return await this.database.get(key);
    };

    private handlePut = async (event: IpcMainEvent, key: string | Buffer, value: Buffer): Promise<void> => {
        await this.database.put(key, value);
    };

    private handleDelete = async (event: IpcMainEvent, key: string | Buffer): Promise<void> => {
        await this.database.delete(key);
    };

    private handleSearch = async (event: IpcMainInvokeEvent, gt: Buffer, lt: Buffer): Promise<Buffer[]> => {
        return await this.database.search({
            gt,
            lt,
        });
    };

    private handleBatchPut = async (
        event: IpcMainInvokeEvent,
        items: IKeyValue<unknown, Buffer>[],
    ): Promise<Buffer[]> => {
        return await this.database.batchPut(items);
    };

    private handleKeys = async (event: IpcMainInvokeEvent, opts?: IFilterOptions<Buffer>): Promise<Buffer[]> => {
        return await this.database.keys(opts);
    };

    private handleValues = async (event: IpcMainInvokeEvent, opts?: IFilterOptions<Buffer>): Promise<Buffer[]> => {
        return await this.database.values(opts);
    };

    private handleValuesStream = (event: IpcMainEvent, id: string): void => {
        const valuesStream = this.database.valuesStream();
        if (!valuesStream) return;
        (async (): Promise<void> => {
            for await (const value of valuesStream) {
                event.sender.send(IpcDatabaseEvents.DATABASE_VALUES_EVENT, id, value);
            }
            event.sender.send(IpcDatabaseEvents.DATABASE_VALUES_EVENT, id, null);
        })();
    };
}
