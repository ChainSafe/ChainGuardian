import React from "react";
import {Line, LineChart, Tooltip, XAxis, XAxisProps} from "recharts";

export type SimpleLineChartRecord = {label: string; value?: number};

interface IProps {
    data: SimpleLineChartRecord[];
    height?: number;
    width?: number;
    xAxis?: Omit<XAxisProps, "dataKey" | "stroke" | "tickLine">;
}

export const SimpleLineChart: React.FC<IProps> = ({data, xAxis = {}, height, width}) => (
    <LineChart width={width} height={height} data={data} margin={{top: 5, bottom: 0, left: 20, right: 20}}>
        <XAxis dataKey='label' stroke='#9ba7af' tickLine={false} {...xAxis} />
        <Tooltip isAnimationActive={false} />
        <defs>
            <linearGradient id='splitColor' x1='0' y1='0' x2='0' y2='1'>
                <stop offset={0} stopColor='#C8F2D7' stopOpacity={1} />
                <stop offset={1} stopColor='#5EB27B' stopOpacity={1} />
            </linearGradient>
        </defs>
        <Line type='natural' dataKey='value' stroke='url(#splitColor)' dot={false} />
    </LineChart>
);
