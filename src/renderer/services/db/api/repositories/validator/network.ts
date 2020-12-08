import {ValidatorNetwork} from "../../../../../models/network";
import {Bucket} from "../../../schema";
import {JSONSerializer} from "../../../serializers/json";
import {Repository} from "../../repository";
import {NetworkType} from "../../../../../models/types/network";
import {IDatabaseController} from "@chainsafe/lodestar-db";

export class ValidatorNetworkRepository extends Repository<ValidatorNetwork> {
    public constructor(db: IDatabaseController<Buffer, Buffer>) {
        super(db, JSONSerializer, Bucket.validatorNetwork, NetworkType);
    }
}
