import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {PasswordPrompt} from "../../components/Prompt/PasswordPrompt";
import {Routes} from "../../constants/routes";

import {calculateROI} from "../../services/utils/math";
import {AddButton} from "../../components/Button/ButtonAction";
import {ButtonDestructive, ButtonPrimary} from "../../components/Button/ButtonStandard";
import {ValidatorStat} from "../../components/Cards/ValidatorStat";
import {PrivateKeyField} from "../../components/PrivateKeyField/PrivateKeyField";
import {InputForm} from "../../components/Input/InputForm";
import {NodeCard} from "../../components/Cards/NodeCard";
import {Keypair} from "@chainsafe/bls";
import {IRootState} from "../../ducks/reducers";
import {
    updateValidatorChainData,
    stopActiveValidatorService,
    startNewValidatorService,
} from "../../ducks/validator/actions";
import {getSelectedNetwork} from "../../ducks/network/selectors";
import {getValidator, getValidatorBeaconNodes} from "../../ducks/validator/selectors";
import {Link} from "react-router-dom";
import {BeaconStatus} from "../../ducks/beacon/slice";

export interface IValidatorSimpleProps {
    publicKey: string;
    onRemoveClick: () => void;
    onDetailsClick: () => void;
    onBeaconNodeClick: (id: string) => () => void;
}

export const Validator: React.FunctionComponent<IValidatorSimpleProps> = (props: IValidatorSimpleProps) => {
    const [askPassword, setAskPassword] = useState<string>(null);
    const dispatch = useDispatch();
    const network = useSelector(getSelectedNetwork);
    const nodes = useSelector((state: IRootState) => getValidatorBeaconNodes(state, props));
    const validator = useSelector((state: IRootState) => getValidator(state, props));

    const isLoaded = !!validator;
    const balance = isLoaded ? validator.balance ?? BigInt(0) : BigInt(0);
    const ROI = calculateROI(balance, network);

    useEffect(() => {
        dispatch(updateValidatorChainData(props.publicKey));
    }, [props.publicKey]);

    const renderBeaconNodes = (): React.ReactElement => {
        return (
            <div className='validator-nodes'>
                <div className='box node-container'>
                    <div className='node-grid-container'>
                        {nodes.length === 0 ? <p>No working beacon nodes.</p> : null}

                        {nodes.map((node, index) => (
                            <div key={`${node.url}-${index}`}>
                                <NodeCard
                                    //TODO: change to some other id when multinode is enabled
                                    onClick={props.onBeaconNodeClick(node.url)}
                                    title={node.docker ? "Local Docker container" : "Remote Beacon node"}
                                    url={node.url}
                                    isSyncing={node.status === BeaconStatus.syncing}
                                    value={"N/A"}
                                />
                            </div>
                        ))}
                    </div>

                    <Link to={Routes.ASSIGN_BEACON_NODE.replace(":validatorKey", props.publicKey)}>
                        <AddButton />
                    </Link>
                </div>
            </div>
        );
    };

    const controlValidator = async (keypair: Keypair): Promise<void> => {
        if (askPassword === "stop") {
            dispatch(stopActiveValidatorService(keypair));
        } else if (askPassword === "start") {
            dispatch(startNewValidatorService(keypair));
        } else if (askPassword === "remove") {
            props.onRemoveClick();
        }
        setAskPassword(null);
    };

    const renderValidatorButtons = (): React.ReactElement => {
        return (
            <div className='flex validator-service-button'>
                {validator.isRunning ? (
                    <ButtonDestructive onClick={(): void => setAskPassword("stop")}>Stop</ButtonDestructive>
                ) : (
                    <ButtonPrimary onClick={(): void => setAskPassword("start")}>Start</ButtonPrimary>
                )}
            </div>
        );
    };

    return (
        <>
            <div className='validator-container'>
                <div className='validator-simple-keys'>
                    <div className='row'>
                        <h2>{validator.name}</h2>
                        {renderValidatorButtons()}
                    </div>
                    <h3>Status: {validator.status || "N/A"}</h3>

                    <br />

                    <div className='row validator-stat-container '>
                        <ValidatorStat title='Balance' type='ETH' value={balance} />
                        <ValidatorStat title='Return (ETH)' type='ROI' value={ROI} />
                        <ValidatorStat title='Validator' type='Status' value={validator.status} />
                    </div>

                    <br />

                    <InputForm
                        label='PUBLIC KEY'
                        focused={false}
                        inputValue={props.publicKey}
                        readOnly={true}
                        type='text'
                    />

                    <PrivateKeyField label='PRIVATE KEY' keystore={validator.keystore} />
                </div>
                <div className='validator-status'>
                    {renderBeaconNodes()}
                    <div className='validator-buttons'>
                        <ButtonDestructive onClick={(): void => setAskPassword("remove")}>REMOVE</ButtonDestructive>
                        <ButtonPrimary onClick={props.onDetailsClick}>DETAILS</ButtonPrimary>
                    </div>
                </div>
            </div>

            <PasswordPrompt
                keystore={validator.keystore}
                display={!!askPassword}
                onSubmit={controlValidator}
                onCancel={(): void => setAskPassword(null)}
            />
        </>
    );
};
