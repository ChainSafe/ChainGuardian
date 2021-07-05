import {Repository} from "../../repository";
import {IDatabaseController} from "@chainsafe/lodestar-db";
import {JSONSerializer} from "../../../serializers/json";
import {Bucket} from "../../../schema";
import {AttestationDutiesTypeType} from "../../../../../models/types/attestationDuties";
import {AttestationDuties, AttestationDuty} from "../../../../../models/attestationDuties";
import {DEFAULT_ACCOUNT} from "../../../../../constants/account";

export class ValidatorAttestationDutiesRepository extends Repository<AttestationDuties> {
    public constructor(db: IDatabaseController<Buffer, Buffer>) {
        super(db, JSONSerializer, Bucket.attestationDuties, AttestationDutiesTypeType);
    }

    public get = async (id: string): Promise<AttestationDuties> =>
        new AttestationDuties(await super.get(this.getKeyName(id)));

    public has = async (id: string): Promise<boolean> => await super.has(this.getKeyName(id));

    public set = async (id: string, value: AttestationDuties): Promise<void> =>
        await super.set(this.getKeyName(id), value);

    public delete = async (id: string): Promise<void> => await super.delete(this.getKeyName(id));

    public putRecords = async (id: string, records: AttestationDuty[]): Promise<void> => {
        const duties = await this.get(id);
        duties.putRecords(records);
        await this.set(id, duties);
    };

    private getKeyName = (key: string): string => `${DEFAULT_ACCOUNT}-${key}`;
}
