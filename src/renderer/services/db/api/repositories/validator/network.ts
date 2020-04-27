import {IDatabaseController} from "../../../../../../main/db/controller";
import {ValidatorNetwork} from "../../../../../models/network";
import {Bucket} from "../../../schema";
import {JSONSerializer} from "../../../serializers/json";
import {Repository} from "../../repository";
import {NetworkType} from "../../../../../models/types/network";

export class ValidatorNetworkRepository extends Repository<ValidatorNetwork> {
    public constructor(db: IDatabaseController) {
        super(db, JSONSerializer, Bucket.validatorNetwork, NetworkType);
    }
}
