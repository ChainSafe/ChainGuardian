import {init as initBLS, SecretKey} from "@chainsafe/bls";
import {LogLevel, WinstonLogger} from "@chainsafe/lodestar-utils";
import {Validator, waitForGenesis} from "@chainsafe/lodestar-validator";
import {CGSlashingProtection} from "../src/renderer/services/eth2/client/slashingProtection";
import sinon from "sinon";
import {computeEpochAtSlot} from "@chainsafe/lodestar-beacon-state-transition";
import {BLSPubkey, phase0} from "@chainsafe/lodestar-types";
import {CgEth2ApiClient} from "../src/renderer/services/eth2/client/module";
import {BeaconEvent, EventData} from "../src/renderer/services/eth2/client/interface";
import {Api as LodestarApi} from "@chainsafe/lodestar-api/lib/interface";
import {EventType} from "@chainsafe/lodestar-api/lib/routes/events";
import {EpochCommitteeResponse} from "@chainsafe/lodestar-api/lib/routes/beacon";
import {ProposerDuty} from "@chainsafe/lodestar-api/lib/routes/validator";
import {IChainForkConfig} from "@chainsafe/lodestar-config/lib/beaconConfig";
import {AbortController} from "node-abort-controller";
import axios from "axios";
import {
    createIChainConfig,
    createIChainForkConfig,
    IChainConfig,
    parsePartialIChainConfigJson,
} from "@chainsafe/lodestar-config";

const getCommitteesFactory = (apiClient: CgEth2ApiClient) => async (
    validatorIndex: number,
    blockSlot: number,
    ignoreBefore?: number,
): Promise<EpochCommitteeResponse[]> => {
    const response = await apiClient.beacon.getEpochCommittees(String(blockSlot));
    return response.data.filter(({validators, slot}: EpochCommitteeResponse) =>
        [...validators].some(
            (index) => index === validatorIndex && (slot > ignoreBefore || ignoreBefore === undefined),
        ),
    );
};

const getProposerFactory = (apiClient: CgEth2ApiClient) => async (
    pubKey: BLSPubkey,
    epoch: number,
    index: number,
    ignoreBefore?: number,
): Promise<ProposerDuty[]> => {
    const result = await apiClient.validator.getProposerDuties(epoch);
    return [...result.data].filter(
        ({validatorIndex, slot}) => validatorIndex === index && (slot > ignoreBefore || ignoreBefore === undefined),
    );
};

const processAttestation = (
    {data}: phase0.Attestation,
    committees: EpochCommitteeResponse[],
    attestations: Map<number, boolean>,
): void => {
    const committee = committees.find(({slot, index}) => slot === data.slot && index === data.index);
    if (committee) {
        attestations.set(committee.slot, true);
    }
};

const processBlock = async (
    {slot}: EventData[EventType.block],
    lastEpoch: number,
    firstSlot: number,
    validatorPublicKeyBytes: Uint8Array,
    validatorIndex: number,
    proposers: Map<number, boolean>,
    attestations: Map<number, boolean>,
    committees: EpochCommitteeResponse[],
    getProposer: ReturnType<typeof getProposerFactory>,
    getCommittees: ReturnType<typeof getCommitteesFactory>,
    limit: number,
): Promise<{
    epoch: number;
    lastEpoch: number;
    committees: EpochCommitteeResponse[];
}> => {
    if (proposers.has(slot)) proposers.set(slot, true);

    const epoch = computeEpochAtSlot(slot);
    if (lastEpoch !== epoch && limit !== epoch) {
        // eslint-disable-next-line no-param-reassign
        lastEpoch = epoch;

        const proposerResponse = await getProposer(validatorPublicKeyBytes, epoch, validatorIndex, firstSlot);
        proposerResponse.forEach(({slot: s}) => {
            proposers.set(s, false);
        });

        // eslint-disable-next-line no-param-reassign
        committees = await getCommittees(validatorIndex, slot, firstSlot);
        committees.forEach(({slot: s}) => {
            attestations.set(s, false);
        });
    }

    return {epoch, lastEpoch, committees};
};

const createConfig = async (baseURL: string): Promise<IChainForkConfig> => {
    const cfg = await axios.get<Record<string, unknown>>("/eth/v1/config/spec", {baseURL});
    const partialChainConfig: Partial<IChainConfig> = parsePartialIChainConfigJson(cfg.data);
    return createIChainForkConfig(createIChainConfig(partialChainConfig));
};

export const restValidation = ({
    baseUrl,
    getValidatorPrivateKey,
    limit,
    ApiClient,
}: {
    baseUrl: string;
    getValidatorPrivateKey: () => Promise<SecretKey>;
    limit: number;
    ApiClient: typeof CgEth2ApiClient;
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
            process.env.NODE_ENV = "validator-test";
            await initBLS("blst-native");
            const validatorPrivateKey = await getValidatorPrivateKey();
            const validatorPublicKey = validatorPrivateKey.toPublicKey();
            const validatorPublicKeyBytes = validatorPublicKey.toBytes();
            console.log("Starting validator " + validatorPublicKey.toHex());

            const logger = new WinstonLogger({module: "ChainGuardian", level: LogLevel.verbose});
            const slashingProtection = sinon.createStubInstance(CGSlashingProtection);

            const config = await createConfig(baseUrl);
            const eth2API = new ApiClient(config, baseUrl);
            const genesis = await waitForGenesis(eth2API as LodestarApi, logger);

            const validatorService = new Validator(
                {
                    slashingProtection,
                    api: eth2API as LodestarApi,
                    config,
                    secretKeys: [validatorPrivateKey],
                    logger,
                    graffiti: "ChainGuardian",
                },
                genesis,
            );
            const {data: validator} = await eth2API.beacon.getStateValidator("head", validatorPublicKey.toHex());
            await validatorService.start();

            let firstSlot: number | undefined;

            let startEpoch = 1;
            let lastEpoch = 1;

            const onFirstBlock = ({slot}: EventData[EventType.block]): void => {
                const epoch = computeEpochAtSlot(slot);
                if (!firstSlot) {
                    firstSlot = slot;
                    startEpoch = epoch;
                }
            };

            const getCommittees = getCommitteesFactory(eth2API);
            let committees: EpochCommitteeResponse[] = [];
            const attestations = new Map<number, boolean>();

            const getProposer = getProposerFactory(eth2API);
            const proposers = new Map<number, boolean>();

            const controller = new AbortController();
            await eth2API.events.eventstream(
                [EventType.block, EventType.attestation],
                controller.signal,
                async ({type, message}: BeaconEvent) => {
                    switch (type) {
                        case EventType.attestation: {
                            processAttestation(message as EventData[EventType.attestation], committees, attestations);
                            break;
                        }
                        case EventType.block: {
                            onFirstBlock(message as EventData[EventType.block]);
                            const {epoch, ...rest} = await processBlock(
                                message as EventData[EventType.block],
                                lastEpoch,
                                firstSlot,
                                validatorPublicKeyBytes,
                                validator.index,
                                proposers,
                                attestations,
                                committees,
                                getProposer,
                                getCommittees,
                                startEpoch + limit,
                            );

                            lastEpoch = rest.lastEpoch;
                            committees = rest.committees;

                            if (startEpoch + limit === epoch) {
                                await validatorService.stop();
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
                            break;
                        }
                    }
                },
                true,
            );
        })();
    });
