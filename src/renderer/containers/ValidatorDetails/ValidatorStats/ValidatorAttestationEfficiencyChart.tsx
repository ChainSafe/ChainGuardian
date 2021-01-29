import React from "react";
import {Bar, BarChart, ResponsiveContainer, TickFormatterFunction, Tooltip, XAxis, Cell} from "recharts";
// @ts-ignore // TODO: add types when get implemented
import Gradient from "javascript-color-gradient";

const colorGradient = new Gradient();
colorGradient.setMidpoint(101);
colorGradient.setGradient("#5EB27B", "#e8ca57", "#E1643A", "#8C3143", "#5E212C");

export type AttestationRecord = {label: string; value?: number};

interface IProps {
    data: AttestationRecord[];
}

export const ValidatorAttestationEfficiencyChart: React.FC<IProps> = ({data}) => {
    const tickFormatter: TickFormatterFunction = (tick: string) => tick.substr(0, 3);
    const formatter = (value: string | number | Array<string | number>): string => value + "%";
    return (
        <div className='node-graph-container'>
            <div className='graph-header'>
                <div className='graph-title'>Attestation Efficiency</div>
            </div>
            <div className='graph-content'>
                <ResponsiveContainer width='100%' height={200}>
                    <BarChart width={624} height={199} data={data} margin={{top: 5, bottom: 0, left: 10, right: 10}}>
                        <XAxis
                            dataKey='label'
                            stroke='#9ba7af'
                            interval='preserveStartEnd'
                            tickLine={false}
                            tickFormatter={tickFormatter}
                        />
                        <Tooltip formatter={formatter} cursor={false} separator=' ' />
                        <Bar dataKey='value' name='Efficiency' barSize={28}>
                            {data.map(({value, label}) => (
                                <Cell
                                    key={label}
                                    fill={value ? colorGradient.getColor(Math.abs(value - 100) + 1) : "#C3CBCF"}
                                    fillOpacity={0.9}
                                    strokeWidth={3}
                                    stroke={value ? colorGradient.getColor(Math.abs(value - 100) + 1) : "#C3CBCF"}
                                    strokeOpacity={0.5}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
