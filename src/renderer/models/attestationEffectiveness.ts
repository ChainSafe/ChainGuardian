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

    public getRecordsFromRange(from: Date | number, to: Date | number = Date.now()): AttestationEfficiency[] {
        // eslint-disable-next-line no-param-reassign
        if (typeof from !== "number") from = from.getTime();
        // eslint-disable-next-line no-param-reassign
        if (typeof to !== "number") to = to.getTime();
        return this.records.filter(({time}) => time > from && time < to);
    }

    public getAverageAttestationEfficiency(from: Date | number, to?: Date | number): number | null {
        const records = this.getRecordsFromRange(from, to);
        if (!records.length) return null;
        return records.reduce((prev, curr) => prev + curr.efficiency, 0) / records.length;
    }

    public addRecord(record: AttestationEfficiency): void {
        this.records.push(record);
    }
}
