import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import {loadValidatorBeaconNodes} from "../../actions/network";
import {loadValidator} from "../../actions/validator";
import {BeaconNode} from "../../models/beaconNode";
import {IRootState} from "../../reducers";
import {calculateROI} from "../../services/utils/math";
import {AddButton} from "../Button/ButtonAction";
import {ButtonDestructive, ButtonPrimary} from "../Button/ButtonStandard";
import {ValidatorStat} from "../Cards/ValidatorStat";
import {PrivateKeyField} from "../PrivateKeyField/PrivateKeyField";
import {InputForm} from "../Input/InputForm";
import {NodeCard} from "../Cards/NodeCard";

export interface IValidatorSimpleProps {
    name: string,
    status: string,
    publicKey: string,
    onRemoveClick: () => void;
    onDetailsClick: () => void;
    privateKey: string;
    nodes: BeaconNode[];
}

export const Validator: React.FunctionComponent<IValidatorSimpleProps> = (
    props: IValidatorSimpleProps) => {
    const validators = useSelector((state: IRootState) => state.validators);
    const network = useSelector((state: IRootState) => state.network.selected);
    const isLoaded = !!validators[props.publicKey];
    const balance = isLoaded ? validators[props.publicKey].balance : 0n;
    const ROI = calculateROI(balance, network);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadValidatorBeaconNodes(props.publicKey, true));
    }, [props.publicKey]);

    useEffect(() => {
        if (props.nodes.length > 0) {
            dispatch(loadValidator(props.publicKey));
        }
    }, [props.publicKey, props.nodes.length]);

    const renderAddBeaconNodeButton = (): React.ReactElement => {
        return true ? null :  <AddButton onClick={(): void=>{}}/>
    };

    const renderBeaconNodes = (): React.ReactElement => {
        return (
            <div className="validator-nodes">
                <div className="box node-container">
                    <div className="node-grid-container">
                        {props.nodes.length === 0 ? <p>No working beacon nodes.</p> : null}

                        {props.nodes.map(node => {
                            return (
                                <NodeCard
                                    key={node.url}
                                    onClick={(): void => {
                                    }}
                                    title={node.localDockerId ? "Local Docker container" : "Remote Beacon node"}
                                    url={node.url}
                                    isSyncing={node.isSyncing}
                                    value={node.currentSlot || "N/A"}
                                />
                            );
                        })}
                    </div>
                    {renderAddBeaconNodeButton()}
                </div>
            </div>
        );
    };

    return(
        <div className="validator-container">
            <div className="validator-simple-keys">
                <h2>{props.name}</h2>
                <br />

                <div className="row validator-stat-container ">
                    <ValidatorStat title="Balance" type="ETH" value={balance}/>
                    <ValidatorStat title="Return (ETH)" type="ROI" value={ROI}/>
                    <ValidatorStat title="Validator" type="Status" value={props.status}/>
                </div>

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
            <div className="validator-status">
                {renderBeaconNodes()}
                <div className="validator-buttons">
                    <ButtonDestructive onClick={props.onRemoveClick}>REMOVE</ButtonDestructive>
                    <ButtonPrimary onClick={props.onDetailsClick}>DETAILS</ButtonPrimary>
                </div>
            </div>
        </div>
    );
};
