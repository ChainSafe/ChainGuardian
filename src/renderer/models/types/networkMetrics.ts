import {ContainerType, NumberUintType, CompositeArrayType} from "@chainsafe/ssz";
import {StringType} from "./basic";
import {NetworkMetric, NetworkMetrics} from "../networkMetrics";

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
        records: new CompositeArrayType({elementType: NetworkMetricType}),
    },
});
