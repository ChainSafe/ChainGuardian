import {DutyStatus} from "../constants/dutyStatus";

export type PropositionDuty = {
    epoch: number;
    slot: number;
    status: DutyStatus;
    timestamp: number;
};

export interface IPropositionDuties {
    records: PropositionDuty[];
}

export class PropositionDuties implements IPropositionDuties {
    public records: PropositionDuty[] = [];

    public constructor(propositionDuties: IPropositionDuties | null) {
        if (propositionDuties !== null) this.records = propositionDuties.records;
    }

    public putRecords(records: PropositionDuty[]): void {
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

    public countMissed(): number {
        return this.records
            .filter(({status}) => status !== DutyStatus.scheduled && status !== DutyStatus.unknown)
            .slice(0, 10)
            .reduce((previous, {status}) => previous + Number(status === DutyStatus.missed), 0);
    }
}
