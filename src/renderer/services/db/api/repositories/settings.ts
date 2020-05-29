import {Repository} from "../repository";
import {Settings} from "../../../../models/settings";
import {Bucket} from "../../schema";
import {IDatabaseController} from "../../../../../main/db/controller";
import {JSONSerializer} from "../../serializers/json";
import {DEFAULT_ACCOUNT} from "../../../../constants/account";
import {SettingsType} from "../../../../models/types/settings";

export class SettingsRepository extends Repository<Settings> {
    public constructor(db: IDatabaseController) {
        super(db, JSONSerializer, Bucket.settings, SettingsType);
    }

    public async get(id: string): Promise<Settings | null> {
        const key = this.getKeyName(id);
        return super.get(key);
    }

    public async has(id: string): Promise<boolean> {
        const key = this.getKeyName(id);
        return super.has(key);
    }

    public async set(id: string, value: Settings): Promise<void> {
        const key = this.getKeyName(id);
        await super.set(key, value);
    }

    public async delete(id: string): Promise<void> {
        const key = this.getKeyName(id);
        await super.delete(key);
    }

    private getKeyName(account = DEFAULT_ACCOUNT): string {
        return account;
    }
}
