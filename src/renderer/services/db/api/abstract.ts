import {IDatabaseController} from "../controller";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {IService} from "../../interfaces";

export interface IDatabaseApiOptions {
    config: IBeaconConfig;
    controller: IDatabaseController;
}

export abstract class DatabaseService implements IService {
    protected readonly config: IBeaconConfig;
    protected readonly db: IDatabaseController;

    protected constructor(opts: IDatabaseApiOptions) {
        this.config = opts.config;
        this.db = opts.controller;
    }

    public async start(): Promise<void> {
        await this.db.start();
    }

    public async stop(): Promise<void> {
        await this.db.stop();
    }
}
