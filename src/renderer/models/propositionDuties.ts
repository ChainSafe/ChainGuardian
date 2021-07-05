import {DutyStatus} from "../constants/dutyStatus";

export type PropositionDuty = {
    epoch: number;
    slot: number;
    status: DutyStatus;
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
