import React, {ReactElement} from "react";
import {BeaconNode as BeaconNodeType} from "../../../models/beaconNode";
import {DockerRegistry} from "../../../services/docker/docker-registry";

interface IBeaconNodeProps {
    node: BeaconNodeType,
}


export const BeaconNode = ({node}: IBeaconNodeProps): ReactElement => {
    const container = DockerRegistry.getContainer(node.localDockerId);
    return (
        <div className="beacon-node">

        </div>
    );
};
