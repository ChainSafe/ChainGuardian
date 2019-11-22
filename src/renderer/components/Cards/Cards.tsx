import * as React from "react";
import BN from "bn.js";

export interface ICardProps {
    textArray: Array<string>;
    value: BN | number;
    
}
export interface INodeCardProps extends ICardProps{
    onClick: () => void;
}
export const ValidatorCard: React.FunctionComponent<ICardProps> = (
    props: ICardProps) => {

    if (props.textArray[1]==="ROI") {
        return(
            <div className="validator-card-container">
                <h5>{props.textArray[0]}</h5>
                <h1 className={props.value>=0 ? "plus":"minus"}>
                    {props.value>=0 ? "+":"-"}{props.value}%</h1>
                <h5 className={props.value>=0 ? "plus":"minus"}>{props.textArray[1]}</h5>
            </div>
        );
    } else {
        return(
            <div className="validator-card-container">
                <h5>{props.textArray[0]}</h5>
                <h1>{
                    props.textArray[1]==="ETH" ? 
                        props.value.toString().slice(1)
                        :
                        props.value
                }</h1>
                <h5>{props.textArray[1]}</h5>
            </div>
        );
    }
};
export const NodeCard: React.FunctionComponent<INodeCardProps> = (
    props: INodeCardProps) => {
    return(
        <div onClick={(): void=>{props.onClick();}} className="node-card-container">
            <h2>{props.textArray[0]}</h2>
            <span className="node-text">{props.textArray[1]}</span>
            <h2>{props.value}ms</h2>
            <span className="node-text time">Average Response Time</span>
        </div>
    );
};