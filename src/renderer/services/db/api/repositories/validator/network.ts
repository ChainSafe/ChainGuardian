import {IDatabaseController} from "../../../../../../main/db/controller";
import {ValidatorNetwork} from "../../../../../models/network";
import {ValidatorNetwork as ValidatorNetworkSSZ} from "../../../../../models/ssz/types";
import {Bucket} from "../../../schema";
import {JSONSerializer} from "../../../serializers/json";
import {Repository} from "../../repository";

export class ValidatorNetworkRepository extends Repository<ValidatorNetwork> {
    public constructor(db: IDatabaseController) {
        super(db, JSONSerializer, Bucket.validatorNetwork, ValidatorNetworkSSZ);
    }
}
