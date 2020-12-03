import {IService} from "../../interfaces";
import {IpcDatabaseController} from "../controller/ipc";
import {IDatabaseController} from "@chainsafe/lodestar-db";

export interface IDatabaseApiOptions {
    controller?: IDatabaseController<Buffer, Buffer>;
}

export abstract class DatabaseService implements IService {
    protected readonly db: IDatabaseController<Buffer, Buffer>;

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
