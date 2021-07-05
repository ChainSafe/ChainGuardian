import {ContainerType, ListType, NumberUintType} from "@chainsafe/ssz";
import {AttestationDuties, AttestationDuty} from "../attestationDuties";

export const AttestationDutyType = new ContainerType<AttestationDuty>({
    fields: {
        epoch: new NumberUintType({byteLength: 32}),
        slot: new NumberUintType({byteLength: 32}),
        status: new NumberUintType({byteLength: 8}),
    },
});
export const AttestationDutiesTypeType = new ContainerType<AttestationDuties>({
    fields: {
        records: new ListType({elementType: AttestationDutyType, limit: 20}),
    },
});
