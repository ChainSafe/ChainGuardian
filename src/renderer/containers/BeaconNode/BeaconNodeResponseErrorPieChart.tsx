import React from "react";
import {Cell, Pie, PieChart} from "recharts";

interface IResponseErrorPieRecord<Label extends string> {
    name: Label;
    value: number | null;
    color: string;
}

export type ResponseErrorPieData = [
    IResponseErrorPieRecord<"2xx">,
    IResponseErrorPieRecord<"4xx">,
    IResponseErrorPieRecord<"5xx">,
];

interface IProps {
    data: ResponseErrorPieData;
}

export const emptyResponseErrorPieData: ResponseErrorPieData = [
    {name: "2xx", value: null, color: "#09BC8A"},
    {name: "4xx", value: null, color: "#EDFF86"},
    {name: "5xx", value: null, color: "#EA526F"},
];

export const BeaconNodeResponseErrorPieChart: React.FC<IProps> = ({data}) => {
    const chartData = data.filter(({value}) => value !== null);
    return (
        <div className='node-graph-container'>
            <div className='graph-header'>
                <div className='graph-title'>Response Code Errors</div>
            </div>
            <div className='graph-content'>
                <div className='graph-legend'>
                    <div className='legend-item success'>2xx</div>
                    <div className='legend-item warning'>4xx</div>
                    <div className='legend-item error'>5xx</div>
                </div>
                <PieChart width={180} height={180}>
                    <Pie
                        animationBegin={100}
                        animationDuration={1000}
                        data={chartData}
                        innerRadius={55}
                        outerRadius={89}
                        dataKey='value'
                        startAngle={90}
                        endAngle={-270}
                        minAngle={10}>
                        {chartData.map(({name, color}) => (
                            <Cell key={name} fill={color} />
                        ))}
                    </Pie>
                </PieChart>
            </div>
        </div>
    );
};
