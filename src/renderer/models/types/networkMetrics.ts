import {ContainerType, NumberUintType, ListType} from "@chainsafe/ssz";
import {NetworkMetric, NetworkMetrics} from "../networkMetrics";
import {StringType} from "@chainsafe/lodestar-types";

const MILLION = 1000000;

export const NetworkMetricType = new ContainerType<NetworkMetric>({
    fields: {
        url: new StringType(),
        code: new NumberUintType({byteLength: 32}),
        latency: new NumberUintType({byteLength: 32}),
        time: new NumberUintType({byteLength: 32}),
    },
});

export const NetworkMetricsType = new ContainerType<NetworkMetrics>({
    fields: {
        records: new ListType({elementType: NetworkMetricType, limit: MILLION}),
    },
});
