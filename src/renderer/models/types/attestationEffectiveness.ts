import {ContainerType, NumberUintType, ListType} from "@chainsafe/ssz";
import {AttestationEfficiency, AttestationEffectiveness} from "../attestationEffectiveness";

const MILLION = 1000000;

export const AttestationEfficiencyType = new ContainerType<AttestationEfficiency>({
    fields: {
        epoch: new NumberUintType({byteLength: 32}),
        slot: new NumberUintType({byteLength: 32}),
        inclusion: new NumberUintType({byteLength: 32}),
        efficiency: new NumberUintType({byteLength: 2}),
        time: new NumberUintType({byteLength: 32}),
    },
});
export const AttestationEffectivenessTypeType = new ContainerType<AttestationEffectiveness>({
    fields: {
        records: new ListType({elementType: AttestationEfficiencyType, limit: MILLION}),
    },
});
