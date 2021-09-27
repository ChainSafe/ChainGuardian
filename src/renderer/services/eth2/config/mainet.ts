import {chainConfig} from "@chainsafe/lodestar-config/default";
import {createIChainForkConfig} from "@chainsafe/lodestar-config";

export const config = createIChainForkConfig(chainConfig);
