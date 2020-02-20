import {Repository} from "../repository";
import {BeaconNode} from "../../../../models/beaconNode";
import {Bucket} from "../../schema";
import {BeaconNode as BeaconNodeType} from "../../../../models/ssz/types";
import {IDatabaseController} from "../../../../../main/db/controller";
import {JSONSerializer} from "../../serializers/json";

export class BeaconNodeRepository extends Repository<BeaconNode> {
    public constructor(db: IDatabaseController) {
        super(db, JSONSerializer, Bucket.beaconNode, BeaconNodeType);
    }
}
