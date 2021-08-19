import {expectSaga} from "redux-saga-test-plan";
import {getAttestationEffectiveness} from "../../../../../src/renderer/ducks/validator/sagas";
import {signedNewAttestation} from "../../../../../src/renderer/ducks/validator/actions";
import {updateSlot} from "../../../../../src/renderer/ducks/beacon/actions";
import {IValidatorComplete} from "../../../../../src/renderer/ducks/validator/slice";
import {V4Keystore} from "../../../../../src/renderer/services/keystore";
import {ValidatorStatus} from "../../../../../src/renderer/constants/validatorStatus";
import {BitList} from "@chainsafe/ssz";
import {CgEth2ApiClient} from "../../../../../src/renderer/services/eth2/client/eth2ApiClient";
import {Attestation} from "@chainsafe/lodestar-types/altair";

const publicKey = "0x9331f1ec6672748ca7b080faff7038da35838f57d223db4f2cb5020246e6c31695c3fb3db0d78db13d266476e34e4e65";
const block = "0xc3687c87021f5b7855465caf6501b3f742f20f26b65cc7a107ff7a78f0b28b79";
const bitsIndex = 4;
const bitsArray = [false, false, false, false, true, false, false, false, false, false, false, false, false, false];
const committee = 11;
const slot = 466969;

const selectedValidator: IValidatorComplete = {
    balance: BigInt(31917137053),
    beaconNodes: ["http://localhost:5052"],
    isRunning: true,
    keystore: undefined as V4Keystore,
    name: "Validator Because Link",
    network: "pyrmont",
    status: ValidatorStatus.ACTIVE,
    publicKey,
};

type Case = {
    slotOffset: number;
    skipped: boolean;
    empty: boolean;
};

type Expect = {
    efficiency: number;
    inclusionOffset: number;
};

export const testAttestationEffectivenessSaga = (
    cases: Case[],
    expects: Expect,
): (() => Promise<void>) => async (): Promise<void> => {
    let index = -1;
    let lastSlot = slot;
    const result = await expectSaga(
        getAttestationEffectiveness,
        signedNewAttestation(publicKey, block, committee, slot, bitsIndex),
    )
        .provide({
            select: () => selectedValidator,
            take: () => {
                index++;
                if (cases[index]) {
                    lastSlot = slot + cases[index].slotOffset;
                } else {
                    lastSlot++;
                }
                return updateSlot(lastSlot, "http://localhost:5052");
            },
            call: (effect, next) => {
                if (effect.args[0] === "http://localhost:5052") return CgEth2ApiClient;
                if (effect.args[0] === publicKey) next();
                else {
                    if (cases[index]) {
                        return mockBeaconBlockAttestations(
                            block,
                            slot,
                            committee,
                            cases[index].skipped,
                            cases[index].empty,
                        );
                    } else {
                        return mockBeaconBlockAttestations(block, slot, committee, false, true);
                    }
                }
            },
        })
        .run(false);

    const {inclusion, efficiency} = result.effects.call[result.effects.call.length - 1].payload.args[1] as {
        inclusion: number;
        efficiency: number;
    };
    expect(efficiency).toEqual(expects.efficiency);
    expect(inclusion).toEqual(slot + expects.inclusionOffset);
};

const mockBeaconBlockAttestations = (
    block: string,
    slot: number,
    index: number,
    skipped: boolean,
    empty: boolean,
): Attestation[] | null => {
    if (skipped) return null;
    const blocks: Attestation[] = [];

    const randomLength = Math.floor(Math.random() * 4);
    for (let i = 0; i <= randomLength; i++) {
        const randomIndex = Math.floor(Math.random() * 30);
        if (randomIndex === index) continue;
        blocks.push(createAttestations(slot, randomIndex, block));
    }
    if (!empty) {
        blocks.push(createAttestations(slot, index, block, bitsArray));
    }

    return blocks;
};

const createAttestations = (slot: number, index: number, beaconBlockRoot: string, bits?: boolean[]): Attestation => ({
    aggregationBits: bits || createRandomAggregationBits(),
    data: {
        slot,
        index,
        beaconBlockRoot: stringToUint8Array(beaconBlockRoot),
        source,
        target,
    },
    signature: stringToUint8Array("0x" + createRandomBigNumber(231).toString(16)),
});
const stringToUint8Array = (string: string): Uint8Array => new Uint8Array(Buffer.from(string.substr(2), "hex"));
const source = {
    epoch: 14591,
    root: stringToUint8Array("0xd0031a93c16cb0293ded16fc2fbe154577b81df0bae7f79b56b2fec70571d048"),
};
const target = {
    epoch: 14592,
    root: stringToUint8Array("0xcc8507c2ac01efd5ac1c8c3a817a7a4ab30b05cb8415fe9b5222ded407eb35c4"),
};
const createRandomBigNumber = (length: number): bigint => {
    let numberString = "";
    for (let i = 0; i <= length; i++) {
        numberString += String(Math.floor(Math.random() * 10));
    }
    return BigInt(numberString);
};
const createRandomAggregationBits = (): BitList => new Array(21).fill(null).map(() => Math.random() > 0.5);
