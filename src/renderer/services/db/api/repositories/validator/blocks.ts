import {Repository} from "../../repository";
import {IDatabaseController} from "../../../../../../main/db/controller";
import {Bucket} from "../../../schema";
import {JSONSerializer} from "../../../serializers/json";
import {types as mainnetTypes} from "@chainsafe/eth2.0-types/lib/ssz/presets/mainnet";
import {SignedBeaconBlock} from "@chainsafe/eth2.0-types";

export class ValidatorBlocksRepository extends Repository<SignedBeaconBlock> {
    public constructor(db: IDatabaseController) {
        super(db, JSONSerializer, Bucket.validatorBlocks, mainnetTypes.SignedBeaconBlock);
    }
}