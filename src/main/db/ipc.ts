import {LevelDbController} from "./controller";
import {IService} from "../../renderer/services/interfaces";
import {getConfig} from "../config/config";
import {IpcDatabaseEvents} from "./events";
import {ipcMain, IpcMainInvokeEvent, IpcMainEvent} from "electron";

export class DatabaseIpcHandler implements IService {

    private database: LevelDbController;

    public constructor() {
        this.database = new LevelDbController({
            location: getConfig().db.name
        });
    }

    public async start(): Promise<void> {
        await this.database.start();
        ipcMain.handle(IpcDatabaseEvents.DATABASE_GET, this.handleGet);
        ipcMain.on(IpcDatabaseEvents.DATABASE_PUT, this.handlePut);
        ipcMain.on(IpcDatabaseEvents.DATABASE_DELETE, this.handleDelete);
        ipcMain.handle(IpcDatabaseEvents.DATABASE_SEARCH, this.handleSearch);
    }

    public async stop(): Promise<void> {
        ipcMain.removeHandler(IpcDatabaseEvents.DATABASE_GET);
        ipcMain.removeListener(IpcDatabaseEvents.DATABASE_GET, this.handleGet);
        ipcMain.removeListener(IpcDatabaseEvents.DATABASE_DELETE, this.handleDelete);
        ipcMain.removeHandler(IpcDatabaseEvents.DATABASE_SEARCH);
        await this.database.stop();

    }

    private handleGet = async (event: IpcMainInvokeEvent, key: string|Buffer): Promise<Buffer | null> => {
        return await this.database.get(key);
    };

    private handlePut = async (event: IpcMainEvent, key: string|Buffer, value: Buffer): Promise<void> => {
        await this.database.put(key, value);
    };

    private handleDelete = async (event: IpcMainEvent, key: string|Buffer): Promise<void> => {
        await this.database.delete(key);
    };

    private handleSearch = async (event: IpcMainInvokeEvent, gt: Buffer, lt: Buffer): Promise<Buffer[]> => {
        return await this.database.search({
            gt,
            lt
        });
    };
}
