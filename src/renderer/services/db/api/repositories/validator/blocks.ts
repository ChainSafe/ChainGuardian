import {Repository} from "../../repository";
import {IDatabaseController} from "../../../../../../main/db/controller";
import {Bucket} from "../../../schema";
import {JSONSerializer} from "../../../serializers/json";
import {config} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import {SignedBeaconBlock} from "@chainsafe/lodestar-types";

export class ValidatorBlocksRepository extends Repository<SignedBeaconBlock> {
    public constructor(db: IDatabaseController) {
        super(db, JSONSerializer, Bucket.validatorBlocks, config.types.SignedBeaconBlock);
    }
}
