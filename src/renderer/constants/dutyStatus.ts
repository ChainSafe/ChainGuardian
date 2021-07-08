export enum DutyStatus {
    unknown = 0,
    scheduled = 1,
    missed = 10,
    orphaned = 11,
    attested = 100,
    proposed = 101,
}

const dutyStatus = new Map([
    [DutyStatus.unknown, "Unknown"],
    [DutyStatus.scheduled, "Scheduled"],
    [DutyStatus.missed, "Missed"],
    [DutyStatus.orphaned, "Orphaned"],
    [DutyStatus.attested, "Attested"],
    [DutyStatus.proposed, "Proposed"],
]);
export const getDutyStatusText = (duty: DutyStatus): string => dutyStatus.get(duty);
