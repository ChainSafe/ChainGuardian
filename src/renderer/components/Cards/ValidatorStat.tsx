import * as React from "react";
import {utils} from "ethers";

export enum Performance {
    unknown,
    offline,
    excellent,
    good,
    fair,
    poor,
}

export interface IValidatorStatProps {
    title: string;
    type: string;
    value?: bigint | number | boolean | Performance;
}
const renderROI = (props: IValidatorStatProps): React.ReactElement => {
    return (
        <div className='validator-card-container'>
            <h5>{props.title}</h5>
            {props.value === undefined ? (
                <h1>N/A</h1>
            ) : (
                <h1 className={props.value >= 0 ? "plus" : "minus"}>
                    {props.value >= 0 ? "+" : ""}
                    {props.value}%
                </h1>
            )}
            <h5 className={props.value === undefined ? "" : props.value >= 0 ? "plus" : "minus"}>{props.type}</h5>
        </div>
    );
};
const renderBalance = (props: IValidatorStatProps): React.ReactElement => {
    return (
        <div className='validator-card-container'>
            <h5>{props.title}</h5>
            {props.value === undefined ? (
                <h1>N/A</h1>
            ) : (
                <h1>
                    {props.value < 1
                        ? props.value.toString().slice(1) || 0
                        : Number(utils.formatEther(utils.parseUnits(props.value.toString(), "gwei"))).toFixed(3)}
                </h1>
            )}
            <h5>{props.type}</h5>
        </div>
    );
};
const renderUptime = (props: IValidatorStatProps): React.ReactElement => {
    return (
        <div className='validator-card-container'>
            <h5>{props.title}</h5>
            <h1>{props.value ? "Online" : "Offline"}</h1>
            <h5>{props.type}</h5>
        </div>
    );
};
const performanceText = (value: Performance): React.ReactElement => {
    switch (value) {
        case Performance.excellent:
            return <h1 className='plus'>Great</h1>;
        case Performance.good:
            return <h1 className='plus'>Good</h1>;
        case Performance.fair:
            return <h1 className='minus'>Fair</h1>;
        case Performance.poor:
            return <h1 className='minus'>Poor</h1>;
        case Performance.offline:
            return <h1>Offline</h1>;
        default:
            return <h1>N/A</h1>;
    }
};
const renderPerformance = (props: IValidatorStatProps): React.ReactElement => {
    return (
        <div className='validator-card-container'>
            <h5>{props.title}</h5>
            {performanceText(props.value as Performance)}
        </div>
    );
};
export const ValidatorStat: React.FunctionComponent<IValidatorStatProps> = (props: IValidatorStatProps) => {
    switch (props.type) {
        case "ROI":
            return renderROI(props);
        case "ETH":
            return renderBalance(props);
        case "Status":
            return renderUptime(props);
        case "Performance":
            return renderPerformance(props);
        default:
            return (
                <div className='validator-card-container'>
                    <h5>{props.title}</h5>
                    <h1>{props.value}</h1>
                    <h5>{props.type}</h5>
                </div>
            );
    }
};
