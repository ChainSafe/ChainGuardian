import React, {useState, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import {Background} from "../../components/Background/Background";
import {ButtonDestructive} from "../../components/Button/ButtonStandard";
import {ConfigureBeaconNode, IConfigureBNSubmitOptions} from "../../components/ConfigureBeaconNode/ConfigureBeaconNode";
import {InputBeaconNode} from "../../components/ConfigureBeaconNode/InputBeaconNode";
import {Loading} from "../../components/Loading/Loading";
import {Routes} from "../../constants/routes";
import {endDockerImagePull, startDockerImagePull} from "../../ducks/network/actions";
import {getPullingDockerImage} from "../../ducks/network/selectors";
import {BeaconChain} from "../../services/docker/chain";
import {Container} from "../../services/docker/container";
import {getNetworkConfig} from "../../services/eth2/networks";
import OnBoardModal from "../Onboard/OnBoardModal";
import {addBeacon, startLocalBeacon} from "../../ducks/beacon/actions";

export const AddBeaconNodeContainer: React.FunctionComponent = () => {
    const isPullingImage = useSelector(getPullingDockerImage);
    const dispatch = useDispatch();
    const history = useHistory();
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [abortCall, setAbortCall] = useState<() => void | undefined>(undefined);

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
        async ({ports, libp2pPort, rpcPort, network, ...rest}: IConfigureBNSubmitOptions): Promise<void> => {
            await pullDockerImage(network);

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
            history.push(Routes.DASHBOARD_ROUTE);
        },
        [],
    );

    const pullDockerImage = (network: string): Promise<void> => {
        dispatch(startDockerImagePull());

        return new Promise(async(resolve) => {
            const image = getNetworkConfig(network).dockerConfig.image;
            const onFinish = (): void => {
                dispatch(endDockerImagePull());
                resolve();
            };
            const {abort} = await BeaconChain.pullImage(image, onFinish);
            setAbortCall(() => abort);
        })
    };

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

                <Loading visible={isPullingImage} title='Pulling Docker image...'>
                    <ButtonDestructive onClick={abortCall}>Cancel</ButtonDestructive>
                </Loading>
            </OnBoardModal>
        </Background>
    );
};
