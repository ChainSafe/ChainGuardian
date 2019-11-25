import * as React from "react";
import BN from "bn.js";

export interface IValidatorCardProps {
    title: string;
    type: string;
    value: BN | number;
}

export const ValidatorCard: React.FunctionComponent<IValidatorCardProps> = (
    props: IValidatorCardProps) => {

    if (props.type==="ROI") {
        return(
            <div className="validator-card-container">
                <h5>{props.title}</h5>
                <h1 className={props.value>=0 ? "plus":"minus"}>
                    {props.value>=0 ? "+":"-"}{props.value}%</h1>
                <h5 className={props.value>=0 ? "plus":"minus"}>{props.type}</h5>
            </div>
        );
    } else {
        return(
            <div className="validator-card-container">
                <h5>{props.title}</h5>
                <h1>{
                    props.type==="ETH" ? 
                        props.value.toString().slice(1)
                        :
                        props.value
                }</h1>
                <h5>{props.type}</h5>
            </div>
        );
    }
};