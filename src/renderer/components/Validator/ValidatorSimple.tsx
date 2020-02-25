import * as React from "react";
import {ButtonSecondary, ButtonDestructive} from "../Button/ButtonStandard";
import {ValidatorStat} from "../Cards/ValidatorStat";
import {PrivateKeyField} from "../PrivateKeyField/PrivateKeyField";
import {InputForm} from "../Input/InputForm";
import {BeaconNode} from "../../models/beaconNode";
import {NodeCard} from "../Cards/NodeCard";

export interface IValidatorSimpleProps {
    name: string,
    status: string,
    publicKey: string,
    deposit: number,
    onRemoveClick: () => void;
    onExportClick: () => void;
    privateKey: string;
    nodes: BeaconNode[];
}

export const ValidatorSimple: React.FunctionComponent<IValidatorSimpleProps> = (
    props: IValidatorSimpleProps) => {

    const renderBeaconNodes = (): React.ReactElement => (
        <div className="validator-nodes">
            <div className="node-container">
                <div className="node-grid-container" >
                    {props.nodes.map(node => (
                        <NodeCard
                            key={node.url}
                            onClick={(): void=>{}}
                            title="Beacon node"
                            url={node.url}
                            value="N/A"
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    return(
        <div className="validator-simple-container">
            <div className="validator-simple-keys">
                <h2>{props.name}</h2>
                <h3>Status: {props.status}</h3>
                <br />

                <ValidatorStat title="Deposit" type="ETH" value={props.deposit}/>

                <br />

                <InputForm
                    label="PUBLIC KEY"
                    focused={false}
                    inputValue={props.publicKey}
                    readOnly={true}
                    type="text"
                />

                <PrivateKeyField
                    label="PRIVATE KEY"
                    inputValue={props.privateKey}
                />
            </div>
            <div className="validator-simple-status">
                {renderBeaconNodes()}
                <div className="validator-simple-buttons">
                    <ButtonDestructive onClick={props.onRemoveClick}>REMOVE</ButtonDestructive>
                    <ButtonSecondary onClick={props.onExportClick}>EXPORT</ButtonSecondary>
                </div>
            </div>
        </div>
    );
};