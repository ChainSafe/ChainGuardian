import {Bucket, encodeKey} from "../schema";
import {ICGSerialization} from "../abstract";
import {Type} from "@chainsafe/ssz";
import {IDatabaseController, IFilterOptions} from "@chainsafe/lodestar-db";

export type Id = Buffer | Uint8Array | string | number | bigint;

export abstract class Repository<T> {
    protected db: IDatabaseController<Buffer, Buffer>;

    protected bucket: Bucket;

    protected type: Type<T>;

    protected serializer: ICGSerialization<unknown>;

    public constructor(
        db: IDatabaseController<Buffer, Buffer>,
        serializer: ICGSerialization<unknown>,
        bucket: Bucket,
        type: Type<T>,
    ) {
        this.db = db;
        this.serializer = serializer;
        this.bucket = bucket;
        this.type = type;
    }

    public async get(id: Id): Promise<T | null> {
        try {
            const value = await this.db.get(encodeKey(this.bucket, id));
            if (!value) return null;
            return this.serializer.deserialize(value, this.type);
        } catch (e) {
            return null;
        }
    }

    public async has(id: Id): Promise<boolean> {
        return (await this.get(id)) !== null;
    }

    public async setUnderRoot(value: T): Promise<void> {
        await this.set(this.serializer.hashTreeRoot(value, this.type), value);
    }

    public async set(id: Id, value: T): Promise<void> {
        await this.db.put(encodeKey(this.bucket, id), this.serializer.serialize(value, this.type));
    }

    public async delete(id: Id): Promise<void> {
        await this.db.delete(encodeKey(this.bucket, id));
    }

    public async getAll(): Promise<T[]> {
        const data = await this.db.values({
            gt: encodeKey(this.bucket, Buffer.alloc(0)),
            lt: encodeKey(this.bucket + 1, Buffer.alloc(0)),
        });
        return (data || []).map((data) => this.serializer.deserialize(data as Buffer, this.type));
    }
}

export abstract class BulkRepository<T> extends Repository<T> {
    public async getAll(id: Buffer | Uint8Array = Buffer.alloc(0), options?: IFilterOptions<Buffer>): Promise<T[]> {
        let searchFilter: IFilterOptions<Buffer>;
        if (options) {
            searchFilter = options;
        } else {
            const key = encodeKey(this.bucket, id);
            searchFilter = {
                lt: encodeKey(this.bucket, Buffer.concat([id, this.fillBufferWithOnes(100)])),
                gte: key,
            };
        }

        const data = await this.db.values(searchFilter);
        return (data || []).map((data) => this.serializer.deserialize(data as Buffer, this.type));
    }

    protected fillBufferWithOnes(size: number): Buffer {
        const maxInteger = Buffer.alloc(1);
        maxInteger.writeUInt8(255, 0);

        return Buffer.alloc(size).fill(maxInteger);
    }

    // public async deleteMany(ids: Id[]): Promise<void> {
    //     const criteria: (Buffer | string)[] = [];
    //     ids.forEach(id => criteria.push(encodeKey(this.bucket, id)));
    //     await this.db.batchDelete(criteria);
    // }

    // public async deleteManyByValue(values: T[]): Promise<void> {
    //     await this.deleteMany(values.map(value => this.serializer.hashTreeRoot(value, this.type)));
    // }
    //
    // public async deleteAll(idFunction?: (value: T) => Id): Promise<void> {
    //     const data = await this.getAll();
    //     const defaultIdFunction: (value: T) => Id = (value): Id => this.serializer.hashTreeRoot(value, this.type);
    //     await this.deleteMany(data.map(idFunction || defaultIdFunction));
    // }
}
