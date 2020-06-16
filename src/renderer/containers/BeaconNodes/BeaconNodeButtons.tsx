import React, {useState} from "react";
import {useDispatch} from "react-redux";
import logger from "electron-log";
import {useHistory} from "react-router";
import {storeNotificationAction} from "../../actions";
import {removeBeaconNodeAction} from "../../actions/network";
import {ButtonDestructive, ButtonInverted, ButtonPrimary} from "../../components/Button/ButtonStandard";
import {ConfirmModal} from "../../components/ConfirmModal/ConfirmModal";
import {Loading} from "../../components/Loading/Loading";
import {DockerRegistry} from "../../services/docker/docker-registry";

interface IBeaconNodeButtonsProps {
    image: string;
    url: string;
    isRunning: boolean;
    validators: string[];
    updateNodeStatus(url: string, status: boolean): void;
}

export const BeaconNodeButtons: React.FunctionComponent<IBeaconNodeButtonsProps> = (props: IBeaconNodeButtonsProps) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {image, url, isRunning} = props;
    const [confirmModal, setConfirmModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const onStopClick = async(image: string, url: string): Promise<void> => {
        setLoading(true);
        try {
            await (DockerRegistry.getContainer(image)!).stop();
            props.updateNodeStatus(url, false);
        } catch (e) {
            logger.error(e);
            dispatch(storeNotificationAction({
                source: history.location.pathname,
                title: "Error while trying to stop beacon node container"
            }));
        }
        setLoading(false);
    };

    const onStartClick = async(image: string, url: string): Promise<void> => {
        setLoading(true);
        try {
            await (DockerRegistry.getContainer(image)!).startStoppedContainer();
            props.updateNodeStatus(url, true);
        } catch (e) {
            logger.error(e);
            dispatch(storeNotificationAction({
                source: history.location.pathname,
                title: "Error while trying to start beacon node container"
            }));
        }
        setLoading(false);
    };

    const onRemoveClick = (): void => {
        setConfirmModal(true);
    };

    const removeContainer = async(): Promise<void> => {
        setLoading(true);
        try {
            await (DockerRegistry.getContainer(image))!.stop();
            await (DockerRegistry.getContainer(image)!).remove();
            props.validators.map((validator) => dispatch(removeBeaconNodeAction(image, validator)));
        } catch (e) {
            logger.error(e);
            dispatch(storeNotificationAction({
                source: history.location.pathname,
                title: "Error while trying to remove beacon node container"
            }));
        }
        setLoading(false);
    };

    return (
        <>
            <div className="row buttons">
                {
                    image ?
                        <>
                            {isRunning ?
                                <ButtonInverted onClick={(): Promise<void> => onStopClick(image, url)}>
                                    Stop
                                </ButtonInverted>
                                :
                                <ButtonPrimary onClick={(): Promise<void> => onStartClick(image, url)}>
                                    Start
                                </ButtonPrimary>
                            }
                        </> : null
                }
                <ButtonDestructive onClick={onRemoveClick}>Remove</ButtonDestructive>
            </div>

            <ConfirmModal
                showModal={confirmModal}
                question={"Are you sure?"}
                description={"This will remove all your beacon chain data."}
                onOKClick={removeContainer}
                onCancelClick={(): void => setConfirmModal(false)}
            />

            <Loading visible={loading} title="Loading" />
        </>
    );
};
