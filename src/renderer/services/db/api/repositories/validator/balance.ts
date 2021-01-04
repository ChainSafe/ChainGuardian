import {Repository} from "../../repository";
import {IDatabaseController} from "@chainsafe/lodestar-db";
import {JSONSerializer} from "../../../serializers/json";
import {Bucket} from "../../../schema";
import {DEFAULT_ACCOUNT} from "../../../../../constants/account";
import {ValidatorBalance, ValidatorBalances} from "../../../../../models/validatorBalances";
import {ValidatorBalancesType} from "../../../../../models/types/validatorBalance";

export class ValidatorBalanceRepository extends Repository<ValidatorBalances> {
    public constructor(db: IDatabaseController<Buffer, Buffer>) {
        super(db, JSONSerializer, Bucket.validatorBalance, ValidatorBalancesType);
    }

    public get = async (id: string): Promise<ValidatorBalances> =>
        new ValidatorBalances(await super.get(this.getKeyName(id)));

    public has = async (id: string): Promise<boolean> => await super.has(this.getKeyName(id));

    public set = async (id: string, value: ValidatorBalances): Promise<void> =>
        await super.set(this.getKeyName(id), value);

    public delete = async (id: string): Promise<void> => await super.delete(this.getKeyName(id));

    public addRecords = async (id: string, records: ValidatorBalance[]): Promise<void> => {
        const balances = await this.get(id);
        for (const record of records) {
            balances.addRecord(record);
        }
        await this.set(id, balances);
    };

    private getKeyName = (key: string): string => `${DEFAULT_ACCOUNT}-${key}`;
}
