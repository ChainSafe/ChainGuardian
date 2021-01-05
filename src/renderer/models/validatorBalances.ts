export type ValidatorBalance = {
    balance: bigint;
    epoch: bigint;
};

export interface IValidatorBalance {
    records: ValidatorBalance[];
}

export class ValidatorBalances implements IValidatorBalance {
    public records: ValidatorBalance[] = [];

    public constructor(validatorBalances: ValidatorBalances | null) {
        if (validatorBalances !== null) this.records = validatorBalances.records;
    }

    public addRecord(record: ValidatorBalance): void {
        if (!this.isExistingRecord(record.epoch)) {
            this.records.push(record);
        }
    }

    public getMissingEpochs(from: bigint, to: bigint): bigint[] {
        return this.getEpochRange(from, to).filter((epoch) => !this.isExistingRecord(epoch));
    }

    public getFirstEpoch(): bigint | null {
        if (!this.records.length) return null;
        return this.records[0].epoch;
    }

    public getLastEpoch(): bigint | null {
        if (!this.records.length) return null;
        return this.records[this.records.length - 1].epoch;
    }

    private getEpochRange(from: bigint, to: bigint): bigint[] {
        const list = [];
        for (let i = from; i <= to; i++) {
            list.push(BigInt(i));
        }
        return list;
    }

    private isExistingRecord(epoch: bigint): boolean {
        return this.records.some((record) => record.epoch === epoch);
    }
}
