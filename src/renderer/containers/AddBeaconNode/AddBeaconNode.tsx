import React, {useState, useCallback} from "react";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router";
import {Background} from "../../components/Background/Background";
import {
    ConfigureBeaconNode,
    IConfigureBNPSubmitOptions,
} from "../../components/ConfigureBeaconNode/ConfigureBeaconNode";
import {InputBeaconNode} from "../../components/ConfigureBeaconNode/InputBeaconNode";
import {Routes} from "../../constants/routes";
import {Container} from "../../services/docker/container";
import OnBoardModal from "../Onboard/OnBoardModal";
import {addBeacon, startLocalBeacon} from "../../ducks/beacon/actions";

export const AddBeaconNodeContainer: React.FunctionComponent = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [currentStep, setCurrentStep] = useState<number>(0);

    const renderFirstStep = (): React.ReactElement => {
        const onRunNodeSubmit = async (): Promise<void> => {
            if (await Container.isDockerInstalled()) {
                setCurrentStep(1);
            } else {
                // TODO: Configure Docker path?
            }
        };

        const onGoSubmit = async (beaconNodeInput: string): Promise<void> => {
            dispatch(addBeacon(beaconNodeInput));
            history.push(Routes.DASHBOARD_ROUTE);
        };

        return <InputBeaconNode onGoSubmit={onGoSubmit} onRunNodeSubmit={onRunNodeSubmit} />;
    };

    const onDockerRunSubmit = useCallback(
        ({ports, libp2pPort, rpcPort, network, ...rest}: IConfigureBNPSubmitOptions): void => {
            dispatch(
                startLocalBeacon({
                    network,
                    libp2pPort,
                    rpcPort,
                    ports: [
                        {...ports[0], local: libp2pPort},
                        {...ports[1], local: rpcPort},
                    ],
                    ...rest,
                }),
            );
            console.log(rest);
            history.push(Routes.DASHBOARD_ROUTE);
        },
        [],
    );

    const renderSecondStep = (): React.ReactElement => {
        return <ConfigureBeaconNode onSubmit={onDockerRunSubmit} />;
    };

    const renderStepScreen = (): React.ReactElement => {
        if (currentStep === 0) return renderFirstStep();
        if (currentStep === 1) return renderSecondStep();
    };

    return (
        <Background>
            <OnBoardModal history={history} currentStep={currentStep}>
                {renderStepScreen()}
            </OnBoardModal>
        </Background>
    );
};
