import {DutyStatus} from "../constants/dutyStatus";

export type AttestationDuty = {
    epoch: number;
    slot: number;
    status: DutyStatus;
};

export interface IAttestationDuties {
    records: AttestationDuty[];
}

export class AttestationDuties implements IAttestationDuties {
    public records: AttestationDuty[] = [];

    public constructor(attestationDuties: IAttestationDuties | null) {
        if (attestationDuties !== null) this.records = attestationDuties.records;
    }

    public putRecords(records: AttestationDuty[]): void {
        for (const record of records) {
            const index = this.records.findIndex(({slot}) => slot === record.slot);
            if (index !== -1) {
                this.records[index] = record;
            } else {
                this.records.unshift(record);
            }
        }

        if (this.records.length > 20) {
            this.records.splice(19);
        }
    }
}
