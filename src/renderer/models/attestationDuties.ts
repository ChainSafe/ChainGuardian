import {DutyStatus} from "../constants/dutyStatus";

export type AttestationDuty = {
    epoch: number;
    slot: number;
    status: DutyStatus;
    timestamp: number;
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
                if (record.status > this.records[index].status) this.records[index] = record;
            } else {
                this.records.unshift(record);
            }
        }

        if (this.records.length > 20) {
            this.records.splice(19);
        }
    }

    public updateMissed(slot: number): void {
        this.records = this.records.map((record) => {
            if ((record.status === DutyStatus.scheduled || record.status === DutyStatus.unknown) && record.slot < slot)
                return {...record, status: DutyStatus.missed};
            return record;
        });
    }
}
