import {
    createIChainConfig,
    IChainConfig,
    parsePartialIChainConfigJson,
    createIChainForkConfig,
} from "@chainsafe/lodestar-config";

const partialChainConfig: Partial<IChainConfig> = parsePartialIChainConfigJson({
    DEPOSIT_CONTRACT_ADDRESS: "0xff50ed3d0ec03aC01D4C79aAd74928BFF48a7b2b",

    // Ethereum Goerli testnet
    DEPOSIT_CHAIN_ID: 5,
    DEPOSIT_NETWORK_ID: 5,

    MIN_GENESIS_TIME: 1614588812, // Wednesday, November 18, 2020 12:00:00 PM UTC
    GENESIS_DELAY: 1919188,
    GENESIS_FORK_VERSION: "0x00001020",

    // Altair
    ALTAIR_FORK_VERSION: "0x01001020",
    ALTAIR_FORK_EPOCH: 36660,
    // Merge
    // MERGE_FORK_VERSION: "0x02001020",
    // MERGE_FORK_EPOCH: Infinity,
    // Sharding
    // SHARDING_FORK_VERSION: "0x03001020",
    // SHARDING_FORK_EPOCH: Infinity,

    // Validator cycle
    INACTIVITY_SCORE_BIAS: 4,
    INACTIVITY_SCORE_RECOVERY_RATE: 16,
    EJECTION_BALANCE: 16000000000,
    MIN_PER_EPOCH_CHURN_LIMIT: 4,
    CHURN_LIMIT_QUOTIENT: 65536,
});

export const config = createIChainForkConfig(createIChainConfig(partialChainConfig));
