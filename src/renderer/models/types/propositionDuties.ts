import {ContainerType, ListType, NumberUintType} from "@chainsafe/ssz";
import {PropositionDuties, PropositionDuty} from "../propositionDuties";

export const PropositionDutyType = new ContainerType<PropositionDuty>({
    fields: {
        epoch: new NumberUintType({byteLength: 32}),
        slot: new NumberUintType({byteLength: 32}),
        status: new NumberUintType({byteLength: 8}),
        timestamp: new NumberUintType({byteLength: 32}),
    },
});
export const PropositionDutiesTypeType = new ContainerType<PropositionDuties>({
    fields: {
        records: new ListType({elementType: PropositionDutyType, limit: 20}),
    },
});
