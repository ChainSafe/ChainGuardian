import {Repository} from "../repository";
import {Bucket} from "../../schema";
import {IDatabaseController} from "../../../../../main/db/controller";
import {JSONSerializer} from "../../serializers/json";
import {DEFAULT_ACCOUNT} from "../../../../constants/account";
import {BeaconsType} from "../../../../models/types/beacons";
import {Beacon, Beacons} from "../../../../models/beacons";

export class BeaconsRepository extends Repository<Beacons> {
    public constructor(db: IDatabaseController) {
        super(db, JSONSerializer, Bucket.beacons, BeaconsType);
    }

    public async get(id = DEFAULT_ACCOUNT): Promise<Beacons | null> {
        return super.get(id);
    }

    public async set(id = DEFAULT_ACCOUNT, value: Beacons): Promise<void> {
        await super.set(id, value);
    }

    public async delete(id = DEFAULT_ACCOUNT): Promise<void> {
        await super.delete(id);
    }

    public async upsert({url, docker}: Beacon): Promise<void> {
        const beacons = await this.get(DEFAULT_ACCOUNT);
        if (beacons) {
            const newList = Beacons.createNodes(beacons.beacons);
            newList.addNode(url, docker);
            await this.set(DEFAULT_ACCOUNT, newList);
        } else {
            await this.set(DEFAULT_ACCOUNT, Beacons.createBeacon(url, docker));
        }
    }

    public async remove(url: string): Promise<[boolean, boolean]> {
        const beacons = await this.get(DEFAULT_ACCOUNT);
        if (beacons) {
            const newList = Beacons.createNodes(beacons.beacons);
            const response = newList.removeNode(url);
            await this.set(DEFAULT_ACCOUNT, newList);
            return response;
        }
    }
}
