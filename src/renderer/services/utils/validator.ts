import {getNetworkConfig} from "../eth2/networks";
import {CgEth2ApiClient} from "../eth2/client/eth2ApiClient";
import {fromHexString} from "@chainsafe/ssz";

export const getValidatorBalance = async (
    publicKey: string,
    network?: string,
    beaconNode?: string,
    stateId: "head" | bigint = "head",
): Promise<undefined | bigint> => {
    if (!network || !beaconNode) return undefined;
    const config = getNetworkConfig(network);
    const eth2Client = new CgEth2ApiClient(config.eth2Config, beaconNode);
    const validatorId = fromHexString(publicKey);
    const validatorState = await eth2Client.beacon.state.getStateValidator(stateId, validatorId);
    return validatorState?.balance || undefined;
};
