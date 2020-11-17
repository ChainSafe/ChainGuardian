import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import logger from "electron-log";
import {useHistory} from "react-router";
import {ButtonDestructive, ButtonInverted, ButtonPrimary} from "../../components/Button/ButtonStandard";
import {ConfirmModal} from "../../components/ConfirmModal/ConfirmModal";
import {Loading} from "../../components/Loading/Loading";
import {DockerRegistry} from "../../services/docker/docker-registry";
import {createNotification} from "../../ducks/notification/actions";
import {Container} from "../../services/docker/container";

interface IBeaconNodeButtonsProps {
    url: string;
    image?: string;
}

export const BeaconNodeButtons: React.FunctionComponent<IBeaconNodeButtonsProps> = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    url,
    image,
}: IBeaconNodeButtonsProps) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [confirmModal, setConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (image) {
            Container.isContainerRunning(image).then(setIsRunning);
        }
    }, []);

    const onStopClick = async (image: string): Promise<void> => {
        setLoading(true);
        try {
            await DockerRegistry.getContainer(image)!.stop();
            setIsRunning(false);
        } catch (e) {
            logger.error(e);
            dispatch(
                createNotification({
                    source: history.location.pathname,
                    title: "Error while trying to stop beacon node container",
                }),
            );
        }
        setLoading(false);
    };

    const onStartClick = async (image: string): Promise<void> => {
        setLoading(true);
        try {
            await DockerRegistry.getContainer(image)!.startStoppedContainer();
            setIsRunning(true);
        } catch (e) {
            logger.error(e);
            dispatch(
                createNotification({
                    source: history.location.pathname,
                    title: "Error while trying to start beacon node container",
                }),
            );
        }
        setLoading(false);
    };

    const onRemoveClick = (): void => {
        setConfirmModal(true);
    };

    const removeContainer = async (): Promise<void> => {
        setLoading(true);
        try {
            const container = DockerRegistry.getContainer(image);
            if (container) {
                await container.stop();
                await container.remove();
            }
        } catch (e) {
            logger.error(e);
            dispatch(
                createNotification({
                    source: history.location.pathname,
                    title: "Error while trying to remove beacon node container",
                }),
            );
        }
        setLoading(false);
    };

    return (
        <>
            <div className='row buttons'>
                {image ? (
                    isRunning ? (
                        <ButtonInverted onClick={(): Promise<void> => onStopClick(image)}>Stop</ButtonInverted>
                    ) : (
                        <ButtonPrimary onClick={(): Promise<void> => onStartClick(image)}>Start</ButtonPrimary>
                    )
                ) : null}
                <ButtonDestructive onClick={onRemoveClick}>Remove</ButtonDestructive>
            </div>

            <ConfirmModal
                showModal={confirmModal}
                question={"Are you sure?"}
                description={"This will remove all your beacon chain data."}
                onOKClick={removeContainer}
                onCancelClick={(): void => setConfirmModal(false)}
            />

            <Loading visible={loading} title='Loading' />
        </>
    );
};
