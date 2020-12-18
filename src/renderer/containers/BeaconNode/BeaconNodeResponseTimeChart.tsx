import React from "react";
import {SimpleLineChart, SimpleLineChartRecord} from "../../components/SimpleLineChart/SimpleLineChart";
import {ResponsiveContainer} from "recharts";

interface IProps {
    data: SimpleLineChartRecord[];
    ticks: string[];
}

export const BeaconNodeResponseTimeChart: React.FC<IProps> = ({data, ticks}) => {
    const formatter = (value: string | number | Array<string | number>): [string, string] => [
        `${value} ms`,
        "average",
    ];
    const labelFormatter = (label: string | number): string => `@ ${label}`;

    return (
        <div className='node-graph-container' style={{width: 850}}>
            <div className='graph-header'>
                <div className='graph-title'>Average Response Time</div>
            </div>
            <div className='graph-content'>
                <ResponsiveContainer width='100%' height={200}>
                    <SimpleLineChart
                        data={data}
                        xAxis={{ticks, tickCount: 24, interval: 1}}
                        tooltip={{formatter, labelFormatter, separator: " "}}
                    />
                </ResponsiveContainer>
            </div>
        </div>
    );
};
