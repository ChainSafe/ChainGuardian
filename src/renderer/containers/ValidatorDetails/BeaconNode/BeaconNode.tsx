import React, {ReactElement} from "react";
import {LogStream} from "../../../components/LogStream/LogStream";
import {BeaconNode as BeaconNodeType} from "../../../models/beaconNode";
import {BeaconChain} from "../../../services/docker/chain";
import {DockerRegistry} from "../../../services/docker/docker-registry";

interface IBeaconNodeProps {
    node: BeaconNodeType;
}

export const BeaconNode = ({node}: IBeaconNodeProps): ReactElement => {
    const container = DockerRegistry.getContainer(node.localDockerId) as BeaconChain;

    return (
        <div className='flex-column stretch'>
            <div className='row space-between'>
                <h3>Beacon Node</h3>
                <h5>{node.url}</h5>
            </div>

            <div className='box log-stream-container'>
                <h4>Log Stream</h4>
                <LogStream source={container ? container.getLogs()! : undefined} />
            </div>
        </div>
    );
};
