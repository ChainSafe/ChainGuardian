import {Id, Repository} from "../repository";
import {CGAccount} from "../../../../models/account";
import {Bucket, encodeKey} from "../../schema";
import {JSONSerializer} from "../../serializers/json";
import {IDatabaseController} from "../../../../../main/db/controller";
import {AccountType} from "../../../../models/types/account";

export class AccountRepository extends Repository<CGAccount> {
    public constructor(db: IDatabaseController) {
        super(db, JSONSerializer, Bucket.account, AccountType);
    }

    // Override get method to wrap deserialized data into CGAccount instance
    public async get(id: Id): Promise<CGAccount | null> {
        try {
            const value = await this.db.get(encodeKey(this.bucket, id));
            if (!value) return null;
            const {name, directory, sendStats} = this.serializer.deserialize(value, this.type);
            return new CGAccount({name, directory, sendStats});
        } catch (e) {
            return null;
        }
    }
}
