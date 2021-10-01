import {
    createIChainConfig,
    createIChainForkConfig,
    IChainConfig,
    parsePartialIChainConfigJson,
} from "@chainsafe/lodestar-config";

const partialChainConfig: Partial<IChainConfig> = parsePartialIChainConfigJson({
    GENESIS_FORK_VERSION: "0x00000000",
});

export const config = createIChainForkConfig(createIChainConfig(partialChainConfig));
