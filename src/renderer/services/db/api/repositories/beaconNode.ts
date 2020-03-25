import {Repository} from "../repository";
import {BeaconNodes} from "../../../../models/beaconNode";
import {Bucket} from "../../schema";
import {ValidatorBeaconNode} from "../../../../models/ssz/types";
import {IDatabaseController} from "../../../../../main/db/controller";
import {JSONSerializer} from "../../serializers/json";
import {DEFAULT_ACCOUNT} from "../../../../constants/account";
import {Type} from "@chainsafe/ssz";

export class BeaconNodeRepository extends Repository<BeaconNodes> {
    public constructor(db: IDatabaseController) {
        super(db, JSONSerializer, Bucket.beaconNodes, ValidatorBeaconNode as unknown as Type<BeaconNodes>);
    }

    public async get(id: string): Promise<BeaconNodes | null> {
        const key = this.getKeyName(id);
        return super.get(key);
    }

    public async has(id: string): Promise<boolean> {
        const key = this.getKeyName(id);
        return super.has(key);
    }

    public async set(id: string, value: BeaconNodes): Promise<void> {
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
