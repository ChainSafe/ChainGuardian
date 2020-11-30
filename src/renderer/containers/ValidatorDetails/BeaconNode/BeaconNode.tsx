import React from "react";
import {LogStream} from "../../../components/LogStream/LogStream";
import {BeaconChain} from "../../../services/docker/chain";
import {DockerRegistry} from "../../../services/docker/docker-registry";
import {Beacon} from "../../../ducks/beacon/slice";

interface IBeaconNodeProps {
    beacon: Beacon;
    showTitle?: boolean;
}

export const BeaconNode: React.FC<IBeaconNodeProps> = ({beacon: {url, docker}, showTitle = true}) => {
    const container = DockerRegistry.getContainer(docker.id) as BeaconChain;
    return (
        <div className='flex-column stretch'>
            {showTitle && (
                <div className='row space-between' style={{paddingTop: "25px"}}>
                    <h2>Beacon Node</h2>
                    <h5>{url}</h5>
                </div>
            )}

            {container && (
                <div className='box log-stream-container'>
                    <h4>Log Stream</h4>
                    <LogStream source={container ? container.getLogs()! : undefined} />
                </div>
            )}
        </div>
    );
};
