import React, {useState, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router";
import {saveBeaconNodeAction, startBeaconChainAction} from "../../actions/network";
import {ConfigureBeaconNode} from "../../components/ConfigureBeaconNode/ConfigureBeaconNode";
import {InputBeaconNode} from "../../components/ConfigureBeaconNode/InputBeaconNode";
import {Routes} from "../../constants/routes";
import {IRootState} from "../../reducers";
import {Container} from "../../services/docker/container";
import {DockerPort} from "../../services/docker/type";
import OnBoardModal from "../Onboard/OnBoardModal";

export const AddBeaconNodeContainer: React.FunctionComponent = () => {
    const {validatorKey} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const validatorNetwork = useSelector(
        (state: IRootState) => state.validators.byPublicKey[validatorKey].network,
    );
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [network, setNetwork] = useState<string|undefined>();

    const renderFirstStep = (): React.ReactElement => {
        const onRunNodeSubmit = async(): Promise<void> => {
            setNetwork(validatorNetwork);

            if (await Container.isDockerInstalled()) {
                setCurrentStep(1);
            } else {
                // TODO: Configure Docker path?
            }
        };


        const onGoSubmit = async(beaconNodeInput: string): Promise<void> => {
            dispatch(saveBeaconNodeAction(beaconNodeInput, undefined, validatorKey));
            history.push(Routes.DASHBOARD_ROUTE);
        };

        return (
            <InputBeaconNode
                validatorNetwork={validatorNetwork}
                onGoSubmit={onGoSubmit}
                onRunNodeSubmit={onRunNodeSubmit}
                displayNetwork={false}
            />
        );
    };

    const onDockerRunSubmit = useCallback((ports: DockerPort[], libp2pPort: string, rpcPort: string): void => {
        // Start beacon chain with selected network and redirect to deposit
        dispatch(startBeaconChainAction(
            network,
            [{...ports[0], local: libp2pPort}, {...ports[1], local: rpcPort}]
        ));
        dispatch(saveBeaconNodeAction(`http://localhost:${rpcPort}`, network, validatorKey));
        history.push(Routes.DASHBOARD_ROUTE);
    }, [network]);

    const renderSecondStep = (): React.ReactElement => {
        return (
            <ConfigureBeaconNode
                network={network}
                onSubmit={onDockerRunSubmit}
            />
        );
    };

    const renderStepScreen = (): React.ReactElement => {
        if (currentStep === 0) return renderFirstStep();
        if (currentStep === 1) return renderSecondStep();
    };

    return (
        <>
            <OnBoardModal
                history={history}
                currentStep={currentStep}
            >
                {renderStepScreen()}
            </OnBoardModal>
        </>
    );
};
