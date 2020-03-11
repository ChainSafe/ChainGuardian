// tslint:disable-next-line: import-name
import {Bucket, encodeKey} from "../schema";
import {ICGSerialization} from "../abstract";
import {IDatabaseController} from "../../../../main/db/controller";
import {AnySSZType} from "@chainsafe/ssz";

export type Id = Buffer | string | number | bigint;

export abstract class Repository<T> {

    protected db: IDatabaseController;

    protected bucket: Bucket;

    protected type: AnySSZType;

    protected serializer: ICGSerialization<unknown>;

    public constructor(
        db: IDatabaseController,
        serializer: ICGSerialization<unknown>,
        bucket: Bucket,
        type: AnySSZType
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
}

export abstract class BulkRepository<T> extends Repository<T> {
    public async getAll(id = Buffer.alloc(0)): Promise<T[]> {
        const key = encodeKey(this.bucket, id);
        const lt = encodeKey(this.bucket, Buffer.concat([id, Buffer.alloc(96).fill(Buffer.from("z"))]));

        const data = await this.db.search({
            gte: key,
            lt,
        });
        return (data || []).map(data => this.serializer.deserialize(data as Buffer, this.type));
    }

    public async getAllFromBucket(): Promise<T[]> {
        const data = await this.db.search({
            gt: encodeKey(this.bucket, Buffer.alloc(0)),
            lt: encodeKey(this.bucket + 1, Buffer.alloc(0))
        });
        return (data || []).map(data => this.serializer.deserialize(data as Buffer, this.type));
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
