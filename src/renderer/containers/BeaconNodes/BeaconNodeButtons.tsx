import React from "react";
import {useDispatch} from "react-redux";
import logger from "electron-log";
import {useHistory} from "react-router";
import {storeNotificationAction} from "../../actions";
import {ButtonDestructive, ButtonInverted, ButtonPrimary} from "../../components/Button/ButtonStandard";
import {DockerRegistry} from "../../services/docker/docker-registry";

interface IBeaconNodeButtonsProps {
    image: string;
    url: string;
    isRunning: boolean;
    updateNodeStatus(url: string, status: boolean): void;
}

export const BeaconNodeButtons: React.FunctionComponent<IBeaconNodeButtonsProps> = (props: IBeaconNodeButtonsProps) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const onStopClick = async(image: string, url: string): Promise<void> => {
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
    };

    const onStartClick = async(image: string, url: string): Promise<void> => {
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
    };

    const onRemoveClick = async(image: string): Promise<void> => {
        try {
            await (DockerRegistry.getContainer(image)!).remove();
            // TODO: Dispatch?
        } catch (e) {
            logger.error(e);
            dispatch(storeNotificationAction({
                source: history.location.pathname,
                title: "Error while trying to remove beacon node container"
            }));
        }
    };

    const {image, url, isRunning} = props;

    return (
        <div className="row buttons">
            {
                image ?
                    <>
                        {isRunning ?
                            <ButtonInverted onClick={(): Promise<void> => onStopClick(image, url)}>Stop</ButtonInverted>
                            :
                            <ButtonPrimary onClick={(): Promise<void> => onStartClick(image, url)}>Start</ButtonPrimary>
                        }
                    </> : null
            }
            <ButtonDestructive onClick={(): Promise<void> => onRemoveClick(image)}>Remove</ButtonDestructive>
        </div>
    );
};
