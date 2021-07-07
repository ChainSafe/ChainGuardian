import React from "react";
import {Line, LineChart, LineType, Tooltip, TooltipProps, XAxis, XAxisProps, YAxis, YAxisProps} from "recharts";

export type SimpleLineChartRecord = {label: string; value?: number};

interface IProps {
    data: SimpleLineChartRecord[];
    height?: number;
    width?: number;
    xAxis?: Omit<XAxisProps, "dataKey" | "stroke" | "tickLine">;
    yAxis?: Omit<YAxisProps, "tickLine">;
    tooltip?: TooltipProps;
    isAnimationActive?: boolean;
    hideTooltip?: boolean;
    lineType?: LineType;
}

export const SimpleLineChart: React.FC<IProps> = ({
    data,
    xAxis = {},
    yAxis = {},
    height,
    width,
    tooltip,
    isAnimationActive,
    hideTooltip,
    lineType = "linear",
}) => (
    <LineChart width={width} height={height} data={data} margin={{top: 5, bottom: 0, left: 20, right: 20}}>
        <XAxis dataKey='label' stroke='#9ba7af' tickLine={false} {...xAxis} />
        <YAxis hide tickLine={false} domain={["dataMin", "dataMax"]} padding={{top: 5, bottom: 10}} {...yAxis} />
        {!hideTooltip && <Tooltip {...tooltip} />}
        <defs>
            <linearGradient id='splitColor' x1='0' y1='0' x2='0' y2='1'>
                <stop offset={0} stopColor='#C8F2D7' stopOpacity={1} />
                <stop offset={1} stopColor='#5EB27B' stopOpacity={1} />
            </linearGradient>
        </defs>
        <Line
            type={lineType}
            dataKey='value'
            stroke='url(#splitColor)'
            dot={false}
            isAnimationActive={isAnimationActive}
        />
    </LineChart>
);
