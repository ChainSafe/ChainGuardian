import React from "react";
import {LogStream} from "../../components/LogStream/LogStream";
import {Beacon} from "../../ducks/beacon/slice";
import {DockerRegistry} from "../../services/docker/docker-registry";
import {BeaconChain} from "../../services/docker/chain";

interface IBeaconNodeProps {
    beacon: Beacon;
}

export const BeaconNodeLogs: React.FC<IBeaconNodeProps> = ({beacon: {docker}}) => {
    const container = docker && (DockerRegistry.getContainer(docker.id) as BeaconChain);
    if (!container) return null;

    return (
        <div className='flex-column stretch'>
            <div className='box log-stream-container'>
                <h4>Log Stream</h4>
                <LogStream source={container ? container.getLogs()! : undefined} />
            </div>
        </div>
    );
};
