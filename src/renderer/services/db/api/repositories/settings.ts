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

    public async get(id = DEFAULT_ACCOUNT): Promise<Settings | null> {
        return super.get(id);
    }

    // TODO: Should merge with existing settings
    public async set(id = DEFAULT_ACCOUNT, value: Settings): Promise<void> {
        await super.set(id, value);
    }

    public async delete(id = DEFAULT_ACCOUNT): Promise<void> {
        await super.delete(id);
    }
}
