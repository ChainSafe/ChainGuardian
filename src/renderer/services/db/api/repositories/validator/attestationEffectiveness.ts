import {Repository} from "../../repository";
import {IDatabaseController} from "@chainsafe/lodestar-db";
import {JSONSerializer} from "../../../serializers/json";
import {Bucket} from "../../../schema";
import {DEFAULT_ACCOUNT} from "../../../../../constants/account";
import {AttestationEffectiveness, AttestationEfficiency} from "../../../../../models/attestationEffectiveness";
import {AttestationEffectivenessTypeType} from "../../../../../models/types/attestationEffectiveness";

export class ValidatorAttestationEffectivenessRepository extends Repository<AttestationEffectiveness> {
    public constructor(db: IDatabaseController<Buffer, Buffer>) {
        super(db, JSONSerializer, Bucket.attestationEffectiveness, AttestationEffectivenessTypeType);
    }

    public get = async (id: string): Promise<AttestationEffectiveness> =>
        new AttestationEffectiveness(await super.get(this.getKeyName(id)));

    public has = async (id: string): Promise<boolean> => await super.has(this.getKeyName(id));

    public set = async (id: string, value: AttestationEffectiveness): Promise<void> =>
        await super.set(this.getKeyName(id), value);

    public delete = async (id: string): Promise<void> => await super.delete(this.getKeyName(id));

    public addRecord = async (id: string, record: AttestationEfficiency): Promise<void> => {
        const effectiveness = await this.get(id);
        effectiveness.addRecord(record);
        await this.set(id, effectiveness);
    };

    private getKeyName = (key: string): string => `${DEFAULT_ACCOUNT}-${key}`;
}
