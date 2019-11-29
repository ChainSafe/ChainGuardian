import * as React from "react";
import {ButtonSecondary, ButtonDestructive} from "../Button/ButtonStandard";
import {ValidatorStat} from "../Cards/ValidatorStat";

export interface IValidatorSimpleProps {
    name: string,
    status: string,
    publicKey: string,
    deposit: number,
    onRemoveClick: () => void;
    onExportClick: () => void;
}

export const ValidatorSimple: React.FunctionComponent<IValidatorSimpleProps> = (
    props: IValidatorSimpleProps) => {

    return(
        <div className="validator-container">
            <div className="validator-stats">
                <h2>{props.name}</h2>
                <div className="validator-stats-container" >
                    <ValidatorStat title="Deposit" type="ETH" value={props.deposit}/>
                </div>
                <h5 className="public-key">PUBLIC KEY: {props.publicKey}</h5>
            </div>
            <div className="validator-nodes-simple">
                <h2>Status: {props.status}</h2>
                <div className="validator-buttons-simple">
                    <ButtonDestructive onClick={(): void=>{props.onRemoveClick;}}>REMOVE</ButtonDestructive>
                    <ButtonSecondary onClick={(): void=>{props.onExportClick;}}>EXPORT</ButtonSecondary>
                </div>
            </div>
        </div>
    );
};