import {IDatabaseController, ISearchOptions} from "../../../../main/db/controller";
import {ipcRenderer} from "electron";
import {IpcDatabaseEvents} from "../../../../main/db/events";

export class IpcDatabaseController implements IDatabaseController {

    public async start(): Promise<void> {
        return;
    }

    public async stop(): Promise<void> {
        return;
    }

    public async get(key: unknown): Promise<Buffer | null> {
        return await ipcRenderer.invoke(IpcDatabaseEvents.DATABASE_GET, key);
    }

    public async search(opts: ISearchOptions): Promise<unknown[]> {
        return await ipcRenderer.invoke(IpcDatabaseEvents.DATABASE_SEARCH, opts.gt, opts.lt);
    }
    
    public async put(key: unknown, value: unknown): Promise<void> {
        await ipcRenderer.send(IpcDatabaseEvents.DATABASE_PUT, key, value);
    }

    public async delete(key: unknown): Promise<void> {
        await ipcRenderer.send(IpcDatabaseEvents.DATABASE_DELETE, key);
    }

}