export enum DutyStatus {
    // dont change order of values
    unknown,
    scheduled,
    missed,
    orphaned,
    proposed,
    attested,
}

const text = ["Unknown", "Scheduled", "Missed", "Orphaned", "Proposed", "Attested"];
export const getDutyStatusText = (duty: DutyStatus): string => text[duty];
