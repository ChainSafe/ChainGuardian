import {Repository, Id} from "../repository";
import {CGAccount} from "../../../../models/account";
import {encodeKey, Bucket} from "../../schema";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {IDatabaseController} from "../../controller";
import {Account} from "../../../../models/ssz/types";
import {JSONSerializer} from "../../serializers/json";

export class AccountRepository extends Repository<CGAccount> {
    public constructor(config: IBeaconConfig, db: IDatabaseController) {
        super(config, db, JSONSerializer, Bucket.account, Account);
    }

    // Override get method to wrap deserialized data into CGAccount instance
    public async get(id: Id): Promise<CGAccount | null> {
        try {
            const value = await this.db.get(encodeKey(this.bucket, id));
            if (!value) return null;
            const {name, directory, sendStats} = this.serializer.deserialize(
                value,
                this.type
            );
            return new CGAccount({name, directory, sendStats});
        } catch (e) {
            return null;
        }
    }
}
