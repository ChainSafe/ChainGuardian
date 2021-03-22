import {init as initBLS, SecretKey} from "@chainsafe/bls";
import {LogLevel, WinstonLogger} from "@chainsafe/lodestar-utils";
import {Validator} from "@chainsafe/lodestar-validator";
import {config} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import {CgEth2ApiClient} from "../src/renderer/services/eth2/client/eth2ApiClient";
import {CGSlashingProtection} from "../src/renderer/services/eth2/client/slashingProtection";
import sinon from "sinon";
import {computeEpochAtSlot} from "@chainsafe/lodestar-beacon-state-transition";
import {BeaconCommitteeResponse, BLSPubkey, ProposerDuty} from "@chainsafe/lodestar-types";
import {AttestationEvent, CGBeaconEventType, ICgEth2ApiClient} from "../src/renderer/services/eth2/client/interface";
import {List} from "@chainsafe/ssz";
import {BeaconEventType, HeadEvent} from "@chainsafe/lodestar-validator/lib/api/interface/events";

const getValidatorIndexInCommitteeFromBits = (aggregationBits: List<boolean>): number => {
    let firstIndex = -1;
    aggregationBits.forEach((bool, index) => {
        if (bool) {
            // in case aggregate and proof we dont want to use index
            if (firstIndex !== -1) return -1;
            firstIndex = index;
        }
    });
    return firstIndex;
};

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
): Promise<ProposerDuty[]> => await apiClient.validator.getProposerDuties(epoch, [pubKey]);

const isBlockProposedFactory = (apiClient: ICgEth2ApiClient) => async (slot: number): Promise<boolean> =>
    !!(await apiClient.beacon.blocks.getBlockAttestations(slot));

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
            process.env.NODE_ENV = "validator-test";
            await initBLS("blst-native");
            const validatorPrivateKey = await getValidatorPrivateKey();
            const validatorPublicKey = validatorPrivateKey.toPublicKey();
            const validatorPublicKeyBytes = validatorPublicKey.toBytes();
            console.log("Starting validator " + validatorPublicKey.toHex());

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
            const validator = await eth2API.beacon.state.getStateValidator("head", validatorPublicKeyBytes);
            await validatorService.start();

            let firstSlot: number | undefined;
            let slot: number | undefined;

            let startEpoch = 1;
            let lastEpoch = 1;

            const getCommittees = getCommitteesFactory(eth2API);
            let committees: BeaconCommitteeResponse[] = [];
            const attestations = new Map<number, boolean>();

            const getProposer = getProposerFactory(eth2API);
            const isBlockProposed = isBlockProposedFactory(eth2API);
            const proposers = new Map<number, boolean>();

            const stream = await eth2API.events.getEventStream(([
                CGBeaconEventType.HEAD,
                CGBeaconEventType.ATTESTATION,
            ] as unknown) as BeaconEventType[]);
            for await (const {type, message} of stream) {
                if (((type as unknown) as CGBeaconEventType.ATTESTATION) === CGBeaconEventType.ATTESTATION) {
                    const {data, aggregationBits} = (message as unknown) as AttestationEvent["message"];
                    const committee = committees.find(({slot, index}) => slot === data.slot && index === data.index);
                    if (committee) {
                        const bitsIndex = getValidatorIndexInCommitteeFromBits(aggregationBits);
                        if (bitsIndex === bitsIndex) {
                            attestations.set(committee.slot, true);
                        }
                    }
                }
                if (((type as unknown) as CGBeaconEventType.HEAD) === CGBeaconEventType.HEAD) {
                    slot = (message as HeadEvent["message"]).slot;
                    const previousSlot = slot - 1;
                    if (proposers.has(previousSlot)) {
                        isBlockProposed(previousSlot).then((b) => {
                            proposers.set(previousSlot, b);
                        });
                    }

                    const epoch = computeEpochAtSlot(config, slot);
                    if (!firstSlot) {
                        firstSlot = slot;
                        startEpoch = epoch;
                    }

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
                    } else if (lastEpoch !== epoch) {
                        lastEpoch = epoch;
                        getProposer(validatorPublicKeyBytes, epoch).then((p) => {
                            p.forEach(({slot: s}) => {
                                proposers.set(s, false);
                            });
                        });

                        getCommittees(validator.index, slot, firstSlot).then((c) => {
                            committees = c;
                            c.forEach(({slot: s}) => {
                                attestations.set(s, false);
                            });
                        });
                    }
                }
            }
        })();
    });
