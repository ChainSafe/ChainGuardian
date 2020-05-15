import React from "react";
import {useSelector, useDispatch} from "react-redux";
import {startValidatorService, stopValidatorService} from "../../actions";

import {IRootState} from "../../reducers";
import {calculateROI} from "../../services/utils/math";
import {AddButton} from "../../components/Button/ButtonAction";
import {ButtonDestructive, ButtonPrimary} from "../../components/Button/ButtonStandard";
import {ValidatorStat} from "../../components/Cards/ValidatorStat";
import {PrivateKeyField} from "../../components/PrivateKeyField/PrivateKeyField";
import {InputForm} from "../../components/Input/InputForm";
import {NodeCard} from "../../components/Cards/NodeCard";

export interface IValidatorSimpleProps {
    name: string,
    status: string,
    publicKey: string,
    onRemoveClick: () => void;
    onDetailsClick: () => void;
    privateKey: string;
}

export const Validator: React.FunctionComponent<IValidatorSimpleProps> = (
    props: IValidatorSimpleProps) => {
    const dispatch = useDispatch();
    const validators = useSelector((state: IRootState) => state.validators);
    const network = useSelector((state: IRootState) => state.network.selected);
    const validatorBeaconNodes = useSelector((state: IRootState) => state.network.validatorBeaconNodes);
    const nodes = Object.prototype.hasOwnProperty.call(validatorBeaconNodes, props.publicKey) ?
        validatorBeaconNodes[props.publicKey] : [];

    const isLoaded = !!validators[props.publicKey];
    const balance = isLoaded ? validators[props.publicKey].balance || 0n : 0n;
    const ROI = calculateROI(balance, network);

    const renderAddBeaconNodeButton = (): React.ReactElement => {
        // eslint-disable-next-line
        return true ? null :  <AddButton onClick={(): void=>{}}/>;
    };

    const renderBeaconNodes = (): React.ReactElement => {
        return (
            <div className="validator-nodes">
                <div className="box node-container">
                    <div className="node-grid-container">
                        {nodes.length === 0 ? <p>No working beacon nodes.</p> : null}

                        {nodes.map(node => {
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

    const renderValidatorButtons = (): React.ReactElement => {
        const isRunning = validators[props.publicKey].isRunning;
        return (
            <div className="flex">
                {isRunning ?
                    <ButtonDestructive onClick={(): void => {dispatch(stopValidatorService(props.publicKey))}}>
                        Stop
                    </ButtonDestructive>
                    :
                    <ButtonPrimary onClick={(): void => {dispatch(startValidatorService(props.publicKey))}}>
                        Start
                    </ButtonPrimary>
                }
            </div>
        );
    };

    return(
        <div className="validator-container">
            <div className="validator-simple-keys">
                <h2>{props.name}</h2>
                <h3>Status: TODO</h3>
                {renderValidatorButtons()}
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
