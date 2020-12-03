/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @module db/controller/impl
 */

import {LevelUp} from "levelup";
// @ts-ignore
import level from "level";
import * as fs from "fs";
import all from "it-all";
import {warn} from "electron-log";
import {IDatabaseController, IFilterOptions, IKeyValue} from "@chainsafe/lodestar-db";
import pushable, {Pushable} from "it-pushable";

export interface ILevelDBOptions {
    db?: LevelUp;
    location: string;
}

/**
 * The LevelDB implementation of DB
 */
export class LevelDbController implements IDatabaseController<Buffer, Buffer> {
    private db!: LevelUp;

    private opts: ILevelDBOptions;

    public constructor(opts: Partial<ILevelDBOptions>) {
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

    public search(opts: IFilterOptions<Buffer>): Promise<Buffer[]> {
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

    public keysStream(opts?: IFilterOptions<Buffer>): AsyncIterable<Buffer> {
        const source: Pushable<Buffer> = pushable();
        this.db
            .createKeyStream({...opts})
            .on("data", function (data) {
                source.push(data);
            })
            .on("close", function () {
                source.end();
            })
            .on("end", function () {
                source.end();
            });
        return source;
    }

    public keys(opts?: IFilterOptions<Buffer>): Promise<Buffer[]> {
        return all(this.keysStream(opts));
    }

    public valuesStream(opts?: IFilterOptions<Buffer>): AsyncIterable<Buffer> {
        const source: Pushable<Buffer> = pushable();
        this.db
            .createValueStream({...opts})
            .on("data", function (data) {
                source.push(data);
            })
            .on("close", function () {
                source.end();
            })
            .on("end", function () {
                source.end();
            });
        return source;
    }

    public values(opts?: IFilterOptions<Buffer>): Promise<Buffer[]> {
        return all(this.valuesStream(opts));
    }

    public entriesStream(): AsyncIterable<IKeyValue<Buffer, Buffer>> {
        throw new Error("Method not implemented.");
    }

    public entries(): Promise<IKeyValue<Buffer, Buffer>[]> {
        throw new Error("Method not implemented.");
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
