import {init as initBLS, SecretKey} from "@chainsafe/bls";
import {LogLevel, WinstonLogger} from "@chainsafe/lodestar-utils";
import {Validator} from "@chainsafe/lodestar-validator";
import {config} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import {CgEth2ApiClient} from "../src/renderer/services/eth2/client/eth2ApiClient";
import {CGSlashingProtection} from "../src/renderer/services/eth2/client/slashingProtection";
import sinon from "sinon";
import EventSource from "eventsource";
import {computeEpochAtSlot} from "@chainsafe/lodestar-beacon-state-transition";
import axios from "axios";

const getValidatorIndexFromBits = (aggregationBits: string): number => {
    const bitArr = config.types.CommitteeBits.fromJson(aggregationBits);
    let firstIndex = -1;
    bitArr.forEach((bool, index) => {
        if (bool) {
            // in case aggregate and proof we dont want to use index
            if (firstIndex !== -1) return -1;
            firstIndex = index;
        }
    });
    return firstIndex;
};

type CommitteesRaw = {
    index: string;
    slot: string;
    validators: string[];
};
type Committees = {
    index: number;
    slot: number;
    validators: number[];
};
const getCommitteesFactory = (baseUrl: string) => async (
    validatorIndex: number,
    blockSlot: number,
    ignoreBefore?: number,
): Promise<Committees[]> => {
    const url = new URL(`/eth/v1/beacon/states/${blockSlot}/committees`, baseUrl);
    const response = await axios.get(url.href);
    const committees = response.data.data.map(({index, slot, validators}: CommitteesRaw) => ({
        index: Number(index),
        slot: Number(slot),
        validators: validators.map(Number),
    }));
    return committees.filter(({validators, slot}: Committees) =>
        validators.some((index) => index === validatorIndex && (slot > ignoreBefore || ignoreBefore === undefined)),
    );
};

type ProposerRaw = {
    pubkey: string;
    // eslint-disable-next-line camelcase
    validator_index: string;
    slot: string;
};
type Proposer = {
    index: number;
    slot: number;
    pubKey: string;
};
const getProposerFactory = (baseUrl: string) => async (
    validatorIndex: number,
    epoch: number,
    ignoreBefore?: number,
): Promise<Proposer[]> => {
    const url = new URL(`/eth/v1/validator/duties/proposer/${epoch}`, baseUrl);
    const response = await axios.get(url.href);
    // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
    const proposers = response.data.data.map(({pubkey, validator_index, slot}: ProposerRaw) => ({
        // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
        index: Number(validator_index),
        slot: Number(slot),
        pubKey: pubkey,
    }));
    return proposers.filter(
        ({slot, index}: Proposer) => validatorIndex === index && (slot > ignoreBefore || ignoreBefore === undefined),
    );
};

const isBlockProposedFactory = (baseUrl: string) => async (slot: number): Promise<boolean> => {
    const url = new URL(`/eth/v1/beacon/blocks/${slot}`, baseUrl);
    try {
        const response = await axios.get(url.href);
        if (Number(response.data.data.message.slot) === slot) {
            return true;
        }
    } catch {
        return false;
    }
    return false;
};

export const restValidation = ({
    baseUrl,
    getValidatorPrivateKey,
    limit,
}: {
    baseUrl: string;
    getValidatorPrivateKey: () => Promise<SecretKey>;
    limit: number;
}): Promise<{
    proposer: {
        proposed: number;
        delegated: number;
    };
    attestation: {
        attestations: number;
        delegated: number;
    };
}> =>
    new Promise((resolve) => {
        (async (): Promise<void> => {
            await initBLS("herumi");
            const validatorPrivateKey = await getValidatorPrivateKey();
            const validatorPublicKey = validatorPrivateKey.toPublicKey().toHex();
            console.log("Starting validator " + validatorPublicKey);

            const logger = new WinstonLogger({module: "ChainGuardian", level: LogLevel.verbose});
            const slashingProtection = sinon.createStubInstance(CGSlashingProtection);

            const eth2API = new CgEth2ApiClient(config, baseUrl);
            const validatorService = new Validator({
                slashingProtection,
                api: eth2API,
                config,
                secretKeys: [validatorPrivateKey],
                logger,
                graffiti: "ChainGuardian",
            });

            let firstSlot: number | undefined;
            let slot: number | undefined;

            let startEpoch = 1;
            let lastEpoch = 1;

            const getCommittees = getCommitteesFactory(baseUrl);
            let committees: Committees[] = [];
            const attestations = new Map<number, boolean>();

            const getProposer = getProposerFactory(baseUrl);
            const isBlockProposed = isBlockProposedFactory(baseUrl);
            const proposers = new Map<number, boolean>();

            const validatorUrl = new URL(`/eth/v1/beacon/states/head/validators/${validatorPublicKey}`, baseUrl);
            const validator = await axios.get(validatorUrl.href);
            const validatorIndex = Number(validator.data.data.index);

            const url = new URL(`/eth/v1/events?topics=attestation,head`, baseUrl);
            const eventSource = new EventSource(url.href);

            eventSource.addEventListener("attestation", (m: any) => {
                const data = JSON.parse(m.data);
                const committee = committees.find(
                    ({slot, index}) => slot === Number(data.data.slot) && index === Number(data.data.index),
                );
                if (committee) {
                    const bitsIndex = getValidatorIndexFromBits(data.aggregation_bits);
                    if (bitsIndex === bitsIndex) {
                        attestations.set(committee.slot, true);
                    }
                }
            });

            eventSource.addEventListener("head", (h: any) => {
                const o = JSON.parse(h.data);
                slot = Number(o.slot);

                const epoch = computeEpochAtSlot(config, slot);
                const previousSlot = slot - 1;
                if (proposers.has(previousSlot)) {
                    isBlockProposed(previousSlot).then((b) => {
                        proposers.set(previousSlot, b);
                    });
                }
                if (!firstSlot) {
                    firstSlot = slot;
                    startEpoch = computeEpochAtSlot(config, slot);
                }
                if (startEpoch + limit === epoch) {
                    validatorService.stop();
                    eventSource.close();
                    resolve({
                        proposer: {
                            proposed: [...proposers.values()].reduce((p, c) => p + Number(c), 0),
                            delegated: proposers.size,
                        },
                        attestation: {
                            attestations: [...attestations.values()].reduce((p, c) => p + Number(c), 0),
                            delegated: attestations.size,
                        },
                    });
                }
                if (lastEpoch !== epoch) {
                    lastEpoch = epoch;
                    getProposer(validatorIndex, epoch, firstSlot).then((p) => {
                        p.forEach(({slot: s}) => {
                            proposers.set(s, false);
                        });
                    });

                    getCommittees(validatorIndex, slot, firstSlot).then((c) => {
                        committees = c;
                        c.forEach(({slot: s}) => {
                            attestations.set(s, false);
                        });
                    });
                }
            });

            await validatorService.start();
        })();
    });
