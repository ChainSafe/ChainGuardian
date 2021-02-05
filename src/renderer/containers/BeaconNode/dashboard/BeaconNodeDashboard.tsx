import React, {useEffect, useState} from "react";
import {Beacon, BeaconStatus} from "../../../ducks/beacon/slice";
import {BeaconNodeResponseTimeChart} from "./BeaconNodeResponseTimeChart";
import {BeaconNodeResponseErrorPieChart, ResponseErrorPieData} from "./BeaconNodeResponseErrorPieChart";
import database from "../../../services/db/api/database";
import {SimpleLineChartRecord} from "../../../components/SimpleLineChart/SimpleLineChart";
import {getLatencyChartData, getNetworkErrorPieData} from "../../../services/utils/charts";
import ReactTooltip from "react-tooltip";
import {capitalize} from "../../../services/utils/formatting";
import {BeaconNodeButtons} from "../../BeaconNodes/BeaconNodeButtons";

interface IBeaconNodeProps {
    beacon: Beacon;
}

export const BeaconNodeDashboard: React.FC<IBeaconNodeProps> = ({beacon: {url, network, slot, status, docker}}) => {
    const [avgLatency, setAvgLatency] = useState<SimpleLineChartRecord[]>([]);
    const [avgLatencyTicks, setAvgLatencyTicks] = useState<string[]>([]);
    const [pieData, setPieData] = useState<ResponseErrorPieData>([
        {name: "2xx", value: null, color: "#09BC8A"},
        {name: "4xx", value: null, color: "#EDFF86"},
        {name: "5xx", value: null, color: "#EA526F"},
    ]);

    useEffect(() => {
        const intervalFn = async (): Promise<void> => {
            const metrics = await database.networkMetrics.get(url);

            // for latency chart
            const newLatencyData = getLatencyChartData(metrics);
            setAvgLatency(newLatencyData.data);
            setAvgLatencyTicks(newLatencyData.ticks);

            // for error pie chart
            setPieData(getNetworkErrorPieData(metrics));
        };
        intervalFn();
        const interval = setInterval(intervalFn, 60 * 1000);
        return (): void => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className='flex-column stretch'>
            <div className='row space-between' style={{paddingTop: "25px"}}>
                <h2>Beacon Node</h2>
                <h5>{url}</h5>
            </div>

            <div className='row space-between'>
                <h2>{capitalize(network)}</h2>
                <div className='row slot-container'>
                    <h3>slot</h3>
                    <h2>
                        {status !== BeaconStatus.offline
                            ? status === BeaconStatus.starting
                                ? "starting"
                                : slot
                            : "N/A"}
                    </h2>
                    {status !== BeaconStatus.offline ? (
                        <>
                            <ReactTooltip />
                            <span
                                className={
                                    status === BeaconStatus.syncing || status === BeaconStatus.starting
                                        ? "sync-progress-icon"
                                        : "success-icon"
                                }
                                data-tip={status === BeaconStatus.syncing ? "Syncing" : "Synced"}
                            />
                        </>
                    ) : null}
                </div>
            </div>

            <div className='beacon-node-charts-container'>
                <BeaconNodeResponseTimeChart data={avgLatency} ticks={avgLatencyTicks} />
                <BeaconNodeResponseErrorPieChart data={pieData} />
            </div>
            <br />

            {docker && <BeaconNodeButtons image={docker.id} url={url} />}
        </div>
    );
};
