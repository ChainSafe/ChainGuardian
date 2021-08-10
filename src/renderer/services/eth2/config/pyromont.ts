import {
    createIChainConfig,
    IChainConfig,
    parsePartialIChainConfigJson,
    createIChainForkConfig,
} from "@chainsafe/lodestar-config";

const partialChainConfig: Partial<IChainConfig> = parsePartialIChainConfigJson({
    GENESIS_FORK_VERSION: "0x00002009",
});

export const config = createIChainForkConfig(createIChainConfig(partialChainConfig));
