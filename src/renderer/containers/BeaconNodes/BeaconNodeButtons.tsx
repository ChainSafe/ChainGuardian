import React from "react";
import {useDispatch} from "react-redux";
import {ButtonDestructive, ButtonInverted, ButtonPrimary} from "../../components/Button/ButtonStandard";
import {DockerRegistry} from "../../services/docker/docker-registry";

interface IBeaconNodeButtonsProps {
    updateNodeStatus(url: string, status: boolean): void;
    image: string;
    url: string;
    isRunning: boolean;
}

export const BeaconNodeButtons: React.FunctionComponent<IBeaconNodeButtonsProps> = (props: IBeaconNodeButtonsProps) => {
    const dispatch = useDispatch();

    const onStopClick = async(image: string, url: string): Promise<void> => {
        await (DockerRegistry.getContainer(image)!).stop();
        props.updateNodeStatus(url, false);
    };

    const onStartClick = async(image: string, url: string): Promise<void> => {
        await (DockerRegistry.getContainer(image)!).startStoppedContainer();
        props.updateNodeStatus(url, true);
    };

    const onRemoveClick = async(image: string): Promise<void> => {
        await (DockerRegistry.getContainer(image)!).remove();
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
    )
};
