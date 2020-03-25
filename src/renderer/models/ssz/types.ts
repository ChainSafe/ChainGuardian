import {BasicListType, BooleanType, ContainerType} from "@chainsafe/ssz";
import {IAccount} from "../account";
import {StringType} from "./string";
import {IBeaconNodes} from "../beaconNode";
import {MAX_VALIDATOR_BEACON_NODES} from "../../constants/account";

export const Account = new ContainerType<IAccount>({
    fields: {
        name: new StringType(),
        directory: new StringType(),
        sendStats: new BooleanType()
    }
});

const BeaconNode = new ContainerType({
    fields: {
        url: new StringType(),
        localDockerId: new StringType()
    }
});

export const ValidatorBeaconNode = new ContainerType<IBeaconNodes>({
    fields: {
        nodes: new BasicListType({elementType: BeaconNode, limit: MAX_VALIDATOR_BEACON_NODES})
    }
});

export const ValidatorNetwork = new ContainerType({
    fields: {
        name: new StringType()
    }
});
