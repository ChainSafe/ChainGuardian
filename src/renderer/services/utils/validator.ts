import {getNetworkConfig} from "../eth2/networks";
import {CgEth2ApiClient} from "../eth2/client/eth2ApiClient";

export const getValidatorBalance = async (
    publicKey: string,
    network?: string,
    beaconNode?: string,
): Promise<undefined | bigint> => {
    if (!network || !beaconNode) return undefined;
    const config = getNetworkConfig(network);
    const eth2Client = new CgEth2ApiClient(config.eth2Config, beaconNode);
    const validatorId = new Uint8Array(Buffer.from(publicKey.substr(2), "hex"));
    const validatorState = await eth2Client.beacon.state.getStateValidator("head", validatorId);
    return validatorState?.balance || undefined;
};
