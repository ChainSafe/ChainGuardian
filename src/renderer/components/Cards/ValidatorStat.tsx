import * as React from "react";
import {utils} from "ethers";

export interface IValidatorStatProps {
    title: string;
    type: string;
    value: bigint | number | string;
}
const renderROI = (props: IValidatorStatProps): React.ReactElement => {
    return(
        <div className="validator-card-container">
            <h5>{props.title}</h5>
            <h1 className={props.value>=0 ? "plus":"minus"}>
                {props.value>=0 ? "+":""}{props.value}%</h1>
            <h5 className={props.value>=0 ? "plus":"minus"}>{props.type}</h5>
        </div>
    );
};
const renderBalance = (props: IValidatorStatProps): React.ReactElement => {
    console.log(props);
    return(
        <div className="validator-card-container">
            <h5>{props.title}</h5>
            <h1>{
                props.value<1 ?
                    props.value.toString().slice(1)
                    :
                    Number(utils.formatEther(utils.parseUnits(props.value.toString(), "gwei"))).toFixed(3)
            }</h1>
            <h5>{props.type}</h5>
        </div>
    );
};
const renderUptime = (props: IValidatorStatProps): React.ReactElement => {
    return(
        <div className="validator-card-container">
            <h5>{props.title}</h5>
            <h1>{props.value ? "Online" : "Offline"}</h1>
            <h5>{props.type}</h5>
        </div>
    );
};
export const ValidatorStat: React.FunctionComponent<IValidatorStatProps> = (
    props: IValidatorStatProps) => {

    switch(props.type){
        case "ROI": return renderROI(props);
        case "ETH": return renderBalance(props);
        case "Status": return renderUptime(props);
        default: return(
            <div className="validator-card-container">
                <h5>{props.title}</h5>
                <h1>{props.value}</h1>
                <h5>{props.type}</h5>
            </div>
        );
    }
};
