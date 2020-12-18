import React from "react";
import {Cell, Pie, PieChart, Tooltip} from "recharts";

interface IResponseErrorPieRecord<Label extends string> {
    name: Label;
    value: number | null;
    color: string;
}

export type ResponseErrorPieData = [
    IResponseErrorPieRecord<"Success">,
    IResponseErrorPieRecord<"Warning">,
    IResponseErrorPieRecord<"Error">,
];

interface IProps {
    data: ResponseErrorPieData;
}

export const emptyResponseErrorPieData: ResponseErrorPieData = [
    {name: "Success", value: null, color: "#09BC8A"},
    {name: "Warning", value: null, color: "#EDFF86"},
    {name: "Error", value: null, color: "#EA526F"},
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
                    <div className='legend-item success'>SUCCESS</div>
                    <div className='legend-item warning'>WARNING</div>
                    <div className='legend-item error'>ERROR</div>
                </div>
                <PieChart width={180} height={180}>
                    <Tooltip isAnimationActive={false} />
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
