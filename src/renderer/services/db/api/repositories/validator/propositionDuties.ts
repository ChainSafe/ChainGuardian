import {Repository} from "../../repository";
import {IDatabaseController} from "@chainsafe/lodestar-db";
import {JSONSerializer} from "../../../serializers/json";
import {Bucket} from "../../../schema";
import {PropositionDutiesTypeType} from "../../../../../models/types/propositionDuties";
import {PropositionDuties, PropositionDuty} from "../../../../../models/propositionDuties";
import {DEFAULT_ACCOUNT} from "../../../../../constants/account";

export class ValidatorPropositionDutiesRepository extends Repository<PropositionDuties> {
    public constructor(db: IDatabaseController<Buffer, Buffer>) {
        super(db, JSONSerializer, Bucket.propositionDuties, PropositionDutiesTypeType);
    }

    public get = async (id: string): Promise<PropositionDuties> =>
        new PropositionDuties(await super.get(this.getKeyName(id)));

    public has = async (id: string): Promise<boolean> => await super.has(this.getKeyName(id));

    public set = async (id: string, value: PropositionDuties): Promise<void> =>
        await super.set(this.getKeyName(id), value);

    public delete = async (id: string): Promise<void> => await super.delete(this.getKeyName(id));

    public putRecords = async (id: string, records: PropositionDuty[]): Promise<void> => {
        const duties = await this.get(id);
        duties.putRecords(records);
        await this.set(id, duties);
    };

    public updateMissed = async (id: string, slot: number): Promise<void> => {
        const duties = await this.get(id);
        duties.updateMissed(slot);
        await this.set(id, duties);
    };

    private getKeyName = (key: string): string => `${DEFAULT_ACCOUNT}-${key}`;
}
