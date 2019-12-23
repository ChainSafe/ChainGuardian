import {IService} from "../../interfaces";
import {IpcDatabaseController} from "../controller/ipc";
import {IDatabaseController} from "../../../../main/db/controller";

export interface IDatabaseApiOptions {
    controller?: IDatabaseController;
}

export abstract class DatabaseService implements IService {
    protected readonly db: IDatabaseController;

    protected constructor(opts: IDatabaseApiOptions) {
        this.db = opts.controller || new IpcDatabaseController();
    }

    public async start(): Promise<void> {
        await this.db.start();
    }

    public async stop(): Promise<void> {
        await this.db.stop();
    }
}
