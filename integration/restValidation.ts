import {init as initBLS, SecretKey} from "@chainsafe/bls";
import {LogLevel, WinstonLogger} from "@chainsafe/lodestar-utils";
import {Validator} from "@chainsafe/lodestar-validator";
import {CGSlashingProtection} from "../src/renderer/services/eth2/client/slashingProtection";
import sinon from "sinon";
import {computeEpochAtSlot} from "@chainsafe/lodestar-beacon-state-transition";
import {BeaconCommitteeResponse, BLSPubkey, ProposerDuty} from "@chainsafe/lodestar-types";
import {AttestationEvent, CGBeaconEventType, ICgEth2ApiClient} from "../src/renderer/services/eth2/client/interface";
import {BeaconBlockEvent, BeaconEventType} from "@chainsafe/lodestar-validator/lib/api/interface/events";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {CgEth2ApiClient} from "../src/renderer/services/eth2/client/module";

const getCommitteesFactory = (apiClient: ICgEth2ApiClient) => async (
    validatorIndex: number,
    blockSlot: number,
    ignoreBefore?: number,
): Promise<BeaconCommitteeResponse[]> => {
    const response = await apiClient.beacon.state.getCommittees(blockSlot);
    return response.filter(({validators, slot}: BeaconCommitteeResponse) =>
        [...validators].some(
            (index) => index === validatorIndex && (slot > ignoreBefore || ignoreBefore === undefined),
        ),
    );
};

const getProposerFactory = (apiClient: ICgEth2ApiClient) => async (
    pubKey: BLSPubkey,
    epoch: number,
    index: number,
    ignoreBefore?: number,
): Promise<ProposerDuty[]> => {
    const result = await apiClient.validator.getProposerDuties(epoch, [pubKey]);
    return [...result].filter(
        ({validatorIndex, slot}) => validatorIndex === index && (slot > ignoreBefore || ignoreBefore === undefined),
    );
};

const processAttestation = (
    {data}: AttestationEvent["message"],
    committees: BeaconCommitteeResponse[],
    attestations: Map<number, boolean>,
): void => {
    const committee = committees.find(({slot, index}) => slot === data.slot && index === data.index);
    if (committee) {
        attestations.set(committee.slot, true);
    }
};

const processBlock = async (
    {slot}: BeaconBlockEvent["message"],
    lastEpoch: number,
    firstSlot: number,
    validatorPublicKeyBytes: Uint8Array,
    validatorIndex: number,
    proposers: Map<number, boolean>,
    attestations: Map<number, boolean>,
    committees: BeaconCommitteeResponse[],
    getProposer: ReturnType<typeof getProposerFactory>,
    getCommittees: ReturnType<typeof getCommitteesFactory>,
    limit: number,
    config: IBeaconConfig,
): Promise<{
    epoch: number;
    lastEpoch: number;
    committees: BeaconCommitteeResponse[];
}> => {
    if (proposers.has(slot)) proposers.set(slot, true);

    const epoch = computeEpochAtSlot(config, slot);
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

export const restValidation = ({
    baseUrl,
    getValidatorPrivateKey,
    limit,
    config,
    ApiClient,
}: {
    baseUrl: string;
    getValidatorPrivateKey: () => Promise<SecretKey>;
    limit: number;
    ApiClient: typeof CgEth2ApiClient;
    config: IBeaconConfig;
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

            const eth2API = new ApiClient(config, baseUrl);
            const validatorService = new Validator({
                slashingProtection,
                api: eth2API,
                config,
                secretKeys: [validatorPrivateKey],
                logger,
                graffiti: "ChainGuardian",
            });
            const validator = await eth2API.beacon.state.getStateValidator("head", validatorPublicKeyBytes);
            await validatorService.start();

            let firstSlot: number | undefined;

            let startEpoch = 1;
            let lastEpoch = 1;

            const onFirstBlock = ({slot}: BeaconBlockEvent["message"]): void => {
                const epoch = computeEpochAtSlot(config, slot);
                if (!firstSlot) {
                    firstSlot = slot;
                    startEpoch = epoch;
                }
            };

            const getCommittees = getCommitteesFactory(eth2API);
            let committees: BeaconCommitteeResponse[] = [];
            const attestations = new Map<number, boolean>();

            const getProposer = getProposerFactory(eth2API);
            const proposers = new Map<number, boolean>();

            const stream = await eth2API.events.getEventStream(([
                CGBeaconEventType.BLOCK,
                CGBeaconEventType.ATTESTATION,
            ] as unknown) as BeaconEventType[]);
            for await (const {type, message} of stream) {
                switch ((type as unknown) as CGBeaconEventType) {
                    case CGBeaconEventType.ATTESTATION: {
                        processAttestation(
                            (message as unknown) as AttestationEvent["message"],
                            committees,
                            attestations,
                        );
                        break;
                    }
                    case CGBeaconEventType.BLOCK: {
                        onFirstBlock((message as unknown) as BeaconBlockEvent["message"]);
                        const {epoch, ...rest} = await processBlock(
                            (message as unknown) as BeaconBlockEvent["message"],
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
                            config,
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
            }
        })();
    });
