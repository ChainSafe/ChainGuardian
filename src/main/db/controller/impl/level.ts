/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @module db/controller/impl
 */

import {LevelUp} from "levelup";
import {IDatabaseController, ISearchOptions} from "../interface";
import {EventEmitter} from "events";
// @ts-ignore
import level from "level";
import * as fs from "fs";
import {warn} from "electron-log";

export interface ILevelDBOptions {
    db?: LevelUp;
    location: string;
}

/**
 * The LevelDB implementation of DB
 */
export class LevelDbController extends EventEmitter implements IDatabaseController {
    private db!: LevelUp;

    private opts: ILevelDBOptions;

    public constructor(opts: Partial<ILevelDBOptions>) {
        super();
        if (!opts.db && !opts.location) {
            throw new Error("Please specify database location");
        }
        this.opts = opts as ILevelDBOptions;
    }

    public async start(): Promise<void> {
        if (!this.db) {
            this.db =
                this.opts.db || level(this.getDatabaseLocation(), {keyEncoding: "binary", valueEncoding: "binary"});
        } else {
            await this.db.open();
        }
    }

    public async stop(): Promise<void> {
        await this.db.close();
    }

    public async get(key: unknown): Promise<Buffer | null> {
        try {
            return await this.db.get(key);
        } catch (e) {
            if (e.notFound) {
                return null;
            }
            throw e;
        }
    }

    public put(key: unknown, value: unknown): Promise<any> {
        return this.db.put(key, value);
    }

    public async batchPut(items: {key: unknown; value: unknown}[]): Promise<any> {
        const batch = this.db.batch();
        items.forEach((item) => batch.put(item.key, item.value));
        await batch.write();
    }

    public async batchDelete(items: unknown[]): Promise<void> {
        const batch = this.db.batch();
        items.forEach((item) => batch.del(item));
        await batch.write();
    }

    public async delete(key: unknown): Promise<void> {
        await this.db.del(key);
    }

    public search(opts: ISearchOptions): Promise<Buffer[]> {
        return new Promise((resolve) => {
            const searchData: Buffer[] = [];
            this.db
                .createValueStream(opts)
                .on("data", (data) => {
                    searchData.push(data);
                })
                .on("close", () => {
                    resolve(searchData);
                })
                .on("end", () => {
                    resolve(searchData);
                });
        });
    }

    private getDatabaseLocation(): string {
        try {
            fs.mkdirSync(this.opts.location, {recursive: true});
        } catch (e) {
            warn("creating database directories", e);
        }
        return this.opts.location;
    }
}
