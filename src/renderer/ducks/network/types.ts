import {IValidatorBeaconNodes} from "../../models/beaconNode";
import {DockerPort} from "../../services/docker/type";

export type BlockSubscriptions = {
    [key: string]: NodeJS.Timeout;
};

export interface INetworkState {
    selected?: string;
    validatorBeaconNodes: IValidatorBeaconNodes;
    blockSubscriptions: BlockSubscriptions;
    pullingDockerImage: boolean;
    finishedPullingDockerImage: boolean;
}

export type StartBeaconChain = (
    network: string,
    ports?: DockerPort[],
) => {
    payload: {
        network: string;
        ports?: DockerPort[];
    };
};

export type SaveBeaconNode = (
    url: string,
    network?: string,
    validatorKey?: string,
) => {
    payload: {
        url: string;
        network?: string;
        validatorKey?: string;
    };
};

export type RemoveBeaconNode = (
    image: string,
    validator: string,
) => {
    payload: {
        image: string;
        validator: string;
    };
};

export type LoadValidatorBeaconNodes = (
    validator: string,
    subscribe?: boolean,
) => {
    payload: {
        validator: string;
        subscribe: boolean;
    };
};
