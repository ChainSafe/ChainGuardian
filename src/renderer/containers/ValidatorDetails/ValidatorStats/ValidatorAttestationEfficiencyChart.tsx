import React from "react";
import {Bar, BarChart, ResponsiveContainer, TickFormatterFunction, Tooltip, XAxis} from "recharts";

interface IProps {
    data: any;
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
                        <Bar dataKey='value' name='Efficiency' fill='#C3CBCF' barSize={28} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
