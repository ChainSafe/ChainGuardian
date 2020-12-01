import {Repository} from "../repository";
import {IDatabaseController} from "../../../../../main/db/controller";
import {JSONSerializer} from "../../serializers/json";
import {Bucket} from "../../schema";
import {DEFAULT_ACCOUNT} from "../../../../constants/account";
import {NetworkLogs, NetworkLog} from "../../../../models/networkLogs";
import {NetworkLogsType} from "../../../../models/types/networkLogs";

export class NetworkLogsRepository extends Repository<NetworkLogs> {
    public constructor(db: IDatabaseController) {
        super(db, JSONSerializer, Bucket.networkLogs, NetworkLogsType);
    }

    public get = async (id: string): Promise<NetworkLogs> => new NetworkLogs(await super.get(this.getKeyName(id)));

    public has = async (id: string): Promise<boolean> => await super.has(this.getKeyName(id));

    public set = async (id: string, value: NetworkLogs): Promise<void> => await super.set(this.getKeyName(id), value);

    public delete = async (id: string): Promise<void> => await super.delete(this.getKeyName(id));

    public addRecord = async (id: string, record: NetworkLog): Promise<void> => {
        const logs = await this.get(id);
        logs.addRecord(record);
        await this.set(id, logs);
    };

    private getKeyName = (key: string): string => `${DEFAULT_ACCOUNT}-${key}`;
}
