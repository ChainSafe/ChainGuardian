import {ContainerType, ListType, NumberUintType} from "@chainsafe/ssz";
import {StringType} from "./basic";
import {NetworkLog, NetworkLogs} from "../networkLogs";

const MILLION = 1000000;

export const NetworkLogType = new ContainerType<NetworkLog>({
    fields: {
        url: new StringType(),
        code: new NumberUintType({byteLength: 32}),
        latency: new NumberUintType({byteLength: 32}),
        time: new NumberUintType({byteLength: 32}),
    },
});

export const NetworkLogsType = new ContainerType<NetworkLogs>({
    fields: {
        records: new ListType({elementType: NetworkLogType, limit: MILLION}),
    },
});
