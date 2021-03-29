import {Repository} from "../repository";
import {Settings} from "../../../../models/settings";
import {Bucket} from "../../schema";
import {JSONSerializer} from "../../serializers/json";
import {DEFAULT_ACCOUNT} from "../../../../constants/account";
import {SettingsType} from "../../../../models/types/settings";
import {IDatabaseController} from "@chainsafe/lodestar-db";

export class SettingsRepository extends Repository<Settings> {
    public constructor(db: IDatabaseController<Buffer, Buffer>) {
        super(db, JSONSerializer, Bucket.settings, SettingsType);
    }

    public async get(id = DEFAULT_ACCOUNT): Promise<Settings | null> {
        return super.get(id);
    }

    public async set(id = DEFAULT_ACCOUNT, value: Settings): Promise<void> {
        // Merge new values with possible existing settings
        const existingRecord = await this.get(id);

        await super.set(id, {
            ...(existingRecord || {dockerPath: ""}),
            ...value,
        });
    }

    public async delete(id = DEFAULT_ACCOUNT): Promise<void> {
        await super.delete(id);
    }
}
