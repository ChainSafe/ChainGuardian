import {Repository} from "../repository";
import {BeaconNode} from "../../../../models/beaconNode";
import {Bucket} from "../../schema";
import {BeaconNode as BeaconNodeType} from "../../../../models/ssz/types";
import {IDatabaseController} from "../../../../../main/db/controller";
import {JSONSerializer} from "../../serializers/json";
import {DEFAULT_ACCOUNT} from "../../../../constants/account";

export class BeaconNodeRepository extends Repository<BeaconNode> {
    public constructor(db: IDatabaseController) {
        super(db, JSONSerializer, Bucket.beaconNode, BeaconNodeType);
    }

    public async get(id: string): Promise<BeaconNode | null> {
        const key = this.getKeyName(id);
        return super.get(key);
    }

    public async has(id: string): Promise<boolean> {
        const key = this.getKeyName(id);
        return super.has(key);
    }

    public async set(id: string, value: BeaconNode): Promise<void> {
        const key = this.getKeyName(id);
        await super.set(key, value);
    }

    public async delete(id: string): Promise<void> {
        const key = this.getKeyName(id);
        await super.delete(key);
    }

    private getKeyName(validatorAddress: string): string {
        return `${DEFAULT_ACCOUNT}-${validatorAddress}`;
    }
}
