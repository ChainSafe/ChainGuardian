import React, {ReactElement} from "react";
import {LogStream} from "../../../components/LogStream/LogStream";
import {BeaconNode as BeaconNodeType} from "../../../models/beaconNode";
import {BeaconChain} from "../../../services/docker/chain";
import {DockerRegistry} from "../../../services/docker/docker-registry";

interface IBeaconNodeProps {
    node: BeaconNodeType,
}

export const BeaconNode = ({node}: IBeaconNodeProps): ReactElement => {
    const container = DockerRegistry.getContainer(node.localDockerId) as BeaconChain;

    return (
        <div className="beacon-node">
            <LogStream stream={container ? container.getLogStream()! : undefined} />
        </div>
    );
};
