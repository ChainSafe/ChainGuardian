import React, {useState, useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import {Background} from "../../components/Background/Background";
import {ButtonDestructive} from "../../components/Button/ButtonStandard";
import {ConfigureBeaconNode, IConfigureBNSubmitOptions} from "../../components/ConfigureBeaconNode/ConfigureBeaconNode";
import {InputBeaconNode} from "../../components/ConfigureBeaconNode/InputBeaconNode";
import {Loading} from "../../components/Loading/Loading";
import {Routes} from "../../constants/routes";
import {cancelDockerPull} from "../../ducks/network/actions";
import {getPullingDockerImage} from "../../ducks/network/selectors";
import {Container} from "../../services/docker/container";
import OnBoardModal from "../Onboard/OnBoardModal";
import {addBeacon, startLocalBeacon} from "../../ducks/beacon/actions";
import {ConfigureDockerPath} from "../../components/ConfigureBeaconNode/ConfigureDockerPath";

export const AddBeaconNodeContainer: React.FunctionComponent = () => {
    const isPullingImage = useSelector(getPullingDockerImage);
    const dispatch = useDispatch();
    const history = useHistory();
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [hasDocker, setHasDocker] = useState<boolean | undefined>();

    useEffect(() => {
        onDockerPathNext();
    }, []);

    const renderFirstStep = (): React.ReactElement => {
        const onRunNodeSubmit = async (): Promise<void> => {
            if (await Container.isDockerInstalled()) {
                setCurrentStep(1);
            }
        };

        const onGoSubmit = async (beaconNodeInput: string, network: string): Promise<void> => {
            dispatch(addBeacon(beaconNodeInput, network));
            history.push(Routes.DASHBOARD_ROUTE);
        };

        return <InputBeaconNode onGoSubmit={onGoSubmit} onRunNodeSubmit={onRunNodeSubmit} />;
    };

    const onDockerRunSubmit = useCallback(
        async ({libp2pPort, rpcPort, network, ...rest}: IConfigureBNSubmitOptions): Promise<void> => {
            dispatch(
                startLocalBeacon(
                    {
                        network,
                        libp2pPort,
                        rpcPort,
                        ...rest,
                    } as IConfigureBNSubmitOptions,
                    () => history.push(Routes.BEACON_NODES),
                ),
            );
        },
        [],
    );

    const onCancelClick = (): void => {
        dispatch(cancelDockerPull());
        history.push(Routes.DASHBOARD_ROUTE);
    };

    const onDockerPathNext = (): void => {
        checkDockerIsInstalled();
    };

    const checkDockerIsInstalled = (): void => {
        Container.isDockerInstalled().then(setHasDocker);
    };

    const renderSecondStep = (): React.ReactElement => {
        if (!hasDocker) return <ConfigureDockerPath onNext={onDockerPathNext} />;
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

                <Loading visible={isPullingImage} title='Pulling Docker image...'>
                    <ButtonDestructive onClick={onCancelClick}>Cancel</ButtonDestructive>
                </Loading>
            </OnBoardModal>
        </Background>
    );
};
