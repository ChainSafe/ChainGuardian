import React, {ReactElement} from "react";
import {BeaconNode as BeaconNodeType} from "../../../models/beaconNode";

interface IBeaconNodeProps {
  node: BeaconNodeType,
}


export const BeaconNode = ({ node }: IBeaconNodeProps): ReactElement => {
    return (
        <div className="beacon-node">
        </div>
    );
};
