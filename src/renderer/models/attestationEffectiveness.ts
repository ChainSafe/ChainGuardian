export type AttestationEfficiency = {
    epoch: number;
    slot: number;
    inclusion: number;
    efficiency: number;
    time: number;
};

export interface IAttestationEffectiveness {
    records: AttestationEfficiency[];
}

export class AttestationEffectiveness implements IAttestationEffectiveness {
    public records: AttestationEfficiency[] = [];

    public constructor(attestationEffectiveness: IAttestationEffectiveness | null) {
        if (attestationEffectiveness !== null) this.records = attestationEffectiveness.records;
    }

    public addRecord(record: AttestationEfficiency): void {
        this.records.push(record);
    }
}
