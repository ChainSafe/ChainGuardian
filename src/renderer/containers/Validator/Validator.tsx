import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useHistory} from "react-router";
import {startValidatorService, stopValidatorService} from "../../actions";
import {PasswordPrompt} from "../../components/Prompt/PasswordPrompt";
import {Routes} from "../../constants/routes";

import {IRootState} from "../../reducers";
import {calculateROI} from "../../services/utils/math";
import {AddButton} from "../../components/Button/ButtonAction";
import {ButtonDestructive, ButtonPrimary} from "../../components/Button/ButtonStandard";
import {ValidatorStat} from "../../components/Cards/ValidatorStat";
import {PrivateKeyField} from "../../components/PrivateKeyField/PrivateKeyField";
import {InputForm} from "../../components/Input/InputForm";
import {NodeCard} from "../../components/Cards/NodeCard";
import {Keypair} from "@chainsafe/bls";

export interface IValidatorSimpleProps {
    name: string,
    status: string,
    publicKey: string,
    onRemoveClick: () => void;
    onDetailsClick: () => void;
    onBeaconNodeClick: (id: string) => () => void;
}

export const Validator: React.FunctionComponent<IValidatorSimpleProps> = (
    props: IValidatorSimpleProps) => {
    const [askPassword, setAskPassword] = useState<string>(null);
    const dispatch = useDispatch();
    const history = useHistory();
    const validators = useSelector((state: IRootState) => state.validators);
    const network = useSelector((state: IRootState) => state.network.selected);
    const validatorBeaconNodes = useSelector((state: IRootState) => state.network.validatorBeaconNodes);
    const nodes = Object.prototype.hasOwnProperty.call(validatorBeaconNodes, props.publicKey) ?
        validatorBeaconNodes[props.publicKey] : [];

    const validator = validators[props.publicKey];
    const isLoaded = !!validator;
    const balance = isLoaded ? validator.balance || 0n : 0n;
    const ROI = calculateROI(balance, network);

    const onAddButtonClick = (): void => {
        history.push(Routes.ADD_BEACON_NODE.replace(":validatorKey", props.publicKey));
    };

    const renderBeaconNodes = (): React.ReactElement => {
        return (
            <div className="validator-nodes">
                <div className="box node-container">
                    <div className="node-grid-container">
                        {nodes.length === 0 ? <p>No working beacon nodes.</p> : null}

                        {nodes.map((node, index) => (
                            <NodeCard
                                key={index}
                                //TODO: change to some other id when multinode is enabled
                                onClick={props.onBeaconNodeClick(node.url)}
                                title={node.localDockerId ? "Local Docker container" : "Remote Beacon node"}
                                url={node.url}
                                isSyncing={node.isSyncing}
                                value={node.currentSlot || "N/A"}
                            />
                        ))}
                    </div>

                    <AddButton onClick={onAddButtonClick} />
                </div>
            </div>
        );
    };

    const controlValidator = async(keypair: Keypair): Promise<void> => {
        if (askPassword === "stop") {
            dispatch(stopValidatorService(keypair));
        } else if (askPassword === "start") {
            dispatch(startValidatorService(keypair));
        } else if (askPassword === "remove") {
            props.onRemoveClick();
        }
        setAskPassword(null);
    };

    const renderValidatorButtons = (): React.ReactElement => {
        const isRunning = validators[props.publicKey].isRunning;
        return (
            <div className="flex validator-service-button">
                {isRunning ?
                    <ButtonDestructive onClick={(): void => setAskPassword("stop")}>
                        Stop
                    </ButtonDestructive>
                    :
                    <ButtonPrimary onClick={(): void => setAskPassword("start")}>
                        Start
                    </ButtonPrimary>
                }
            </div>
        );
    };

    return(
        <>
            <div className="validator-container">
                <div className="validator-simple-keys">
                    <div className="row">
                        <h2>{props.name}</h2>
                        {renderValidatorButtons()}
                    </div>
                    <h3>Status: {validator.status || "N/A"}</h3>

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
                        keystore={validator.keystore}
                    />
                </div>
                <div className="validator-status">
                    {renderBeaconNodes()}
                    <div className="validator-buttons">
                        <ButtonDestructive onClick={(): void => setAskPassword("remove")}>REMOVE</ButtonDestructive>
                        <ButtonPrimary onClick={props.onDetailsClick}>DETAILS</ButtonPrimary>
                    </div>
                </div>
            </div>

            <PasswordPrompt
                keystore={validator.keystore}
                display={!!askPassword}
                onSubmit={controlValidator}
                onCancel={(): void=> setAskPassword(null)}
            />
        </>
    );
};
