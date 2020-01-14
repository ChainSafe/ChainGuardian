import * as React from "react";
import {ButtonSecondary, ButtonDestructive} from "../Button/ButtonStandard";
import {ValidatorStat} from "../Cards/ValidatorStat";
import {PrivateKeyField} from "../PrivateKeyField/PrivateKeyField";
import {InputForm} from "../Input/InputForm";

export interface IValidatorSimpleProps {
    name: string,
    status: string,
    publicKey: string,
    deposit: number,
    onRemoveClick: () => void;
    onExportClick: () => void;
    privateKey: string;
}

export const ValidatorSimple: React.FunctionComponent<IValidatorSimpleProps> = (
    props: IValidatorSimpleProps) => {

    return(
        <div className="validator-simple-container">
            <div className="validator-simple-keys">
                <h2>{props.name}</h2>
                <PrivateKeyField
                    label="PRIVATE KEY"
                    inputValue={props.privateKey}
                />
                <InputForm
                    label="PUBLIC KEY"
                    focused={false}
                    inputValue={props.publicKey}
                    readOnly={true}
                    type="text"
                />
            </div>
            <div className="validator-simple-status">
                <h2>Status: {props.status}</h2>
                <ValidatorStat title="Deposit" type="ETH" value={props.deposit}/>
                <div className="validator-simple-buttons">
                    <ButtonDestructive onClick={props.onRemoveClick}>REMOVE</ButtonDestructive>
                    <ButtonSecondary onClick={props.onExportClick}>EXPORT</ButtonSecondary>
                </div>
            </div>
        </div>
    );
};