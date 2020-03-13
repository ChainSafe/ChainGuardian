/**
 * @module db/controller
 */

export interface ISearchOptions {
    gte?: unknown;
    gt?: unknown;
    lt?: unknown;
    lte?: unknown;
    reverse?: boolean;
    limit?: number;
}

export interface IDatabaseController {
    get(key: unknown): Promise<Buffer | null>;

    // batchPut(items: { key: unknown; value: unknown }[]): Promise<void>;
    //
    // batchDelete(items: unknown[]): Promise<void>;

    /**
     * Should return items which has key prefix >= opts.gt && prefix < opt.lt
     * @param opts
     */
    search(opts: ISearchOptions): Promise<unknown[]>;

    /**
     * Should insert or update
     * @param key
     * @param value
     */
    put(key: unknown, value: unknown): Promise<unknown>;

    delete(key: unknown): Promise<void>;

    start(): Promise<void>;

    stop(): Promise<void>;
}
