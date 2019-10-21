import {Repository, Id} from "../repository";
import {CGAccount} from "../../../../models/account";
import {encodeKey} from "../../schema";

export class AccountRepository extends Repository<CGAccount> {
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
