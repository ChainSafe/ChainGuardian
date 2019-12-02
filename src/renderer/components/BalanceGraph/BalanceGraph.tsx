import * as React from "react";
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";


export interface IBalanceGraphProps {

}

export const BalanceGraph: React.FunctionComponent<IBalanceGraphProps> = (props: IBalanceGraphProps) => {
    const data = [
        {
          name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
        },
        {
          name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
        },
        {
          name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
        },
        {
          name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
        },
        {
          name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
        },
        {
          name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
        },
        {
          name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
        },
      ];
    return(
        <div className="balance-graph">
            <div className="graph-header">
                <div className="graph-title">Validator Balance</div>
                <div className="graph-options">
                    <div className="graph-option">1H</div>
                    <div className="graph-option">1D</div>
                    <div className="graph-option">1W</div>
                    <div className="graph-option">1M</div>
                    <div className="graph-option">1Y</div>
                    <div className="graph-option">ALL</div>
                </div>
            </div>
            <LineChart
                width={624}
                height={199}
                data={data}
                margin={{top: 5, bottom: 0, left: 0, right: 0,}}>
                <XAxis dataKey="name" stroke="#9ba7af"/>
                {/* <YAxis /> */}
                <Tooltip />
                <Line type="step" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
        </div>
    );
}