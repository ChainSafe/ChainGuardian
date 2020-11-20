import {Repository} from "../repository";
import {Bucket} from "../../schema";
import {IDatabaseController} from "../../../../../main/db/controller";
import {JSONSerializer} from "../../serializers/json";
import {DEFAULT_ACCOUNT} from "../../../../constants/account";
import {ValidatorBeaconNodesType} from "../../../../models/types/validatorBeaconNodes";
import {ValidatorBeaconNodes} from "../../../../models/validatorBeaconNodes";

/**
 * Repository for validators beacon node list
 * stores beacon nodes url based on validator public key
 * */
export class ValidatorBeaconNodesRepository extends Repository<ValidatorBeaconNodes> {
    public constructor(db: IDatabaseController) {
        super(db, JSONSerializer, Bucket.validatorBeaconNodes, ValidatorBeaconNodesType);
    }

    public async get(id: string): Promise<ValidatorBeaconNodes | null> {
        const key = this.getKeyName(id);
        return super.get(key);
    }

    public async has(id: string): Promise<boolean> {
        const key = this.getKeyName(id);
        return super.has(key);
    }

    public async set(id: string, value: ValidatorBeaconNodes): Promise<void> {
        const key = this.getKeyName(id);
        await super.set(key, value);
    }

    public async delete(id: string): Promise<void> {
        const key = this.getKeyName(id);
        await super.delete(key);
    }

    public async upsert(id: string, values: string[]): Promise<ValidatorBeaconNodes> {
        const validatorBeaconNodes = await this.get(id);
        const newList = validatorBeaconNodes
            ? ValidatorBeaconNodes.createNodes(validatorBeaconNodes.nodes)
            : new ValidatorBeaconNodes();
        values.forEach((value) => newList.addNode(value));
        await this.set(id, newList);
        return newList;
    }

    private getKeyName(validatorAddress: string): string {
        return `${DEFAULT_ACCOUNT}-${validatorAddress}`;
    }
}
