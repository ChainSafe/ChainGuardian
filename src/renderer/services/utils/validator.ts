import {getNetworkConfig} from "../eth2/networks";
import {fromHexString} from "@chainsafe/ssz";
import {getBeaconNodeEth2ApiClient} from "../eth2/client/module";

export const getValidatorBalance = async (
    publicKey: string,
    network?: string,
    beaconNode?: string,
    stateId: "head" | number = "head",
): Promise<undefined | bigint> => {
    if (!network || !beaconNode) return undefined;
    const config = getNetworkConfig(network);
    const ApiClient = await getBeaconNodeEth2ApiClient(beaconNode);
    const eth2Client = new ApiClient(config.eth2Config, beaconNode);
    const validatorId = fromHexString(publicKey);
    const validatorState = await eth2Client.beacon.state.getStateValidator(stateId, validatorId);
    return validatorState?.balance || undefined;
};
