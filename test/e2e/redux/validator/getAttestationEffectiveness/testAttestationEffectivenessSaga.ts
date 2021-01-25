import {expectSaga} from "redux-saga-test-plan";
import {getAttestationEffectiveness} from "../../../../../src/renderer/ducks/validator/sagas";
import {signedNewAttestation} from "../../../../../src/renderer/ducks/validator/actions";
import {updateSlot} from "../../../../../src/renderer/ducks/beacon/actions";
import {mockBeaconBlockAttestations} from "./mockBeaconBlockAttestations";
import {IValidatorComplete} from "../../../../../src/renderer/ducks/validator/slice";
import {V4Keystore} from "../../../../../src/renderer/services/keystore";
import {ValidatorStatus} from "../../../../../src/renderer/constants/validatorStatus";

const publicKey = "0x9331f1ec6672748ca7b080faff7038da35838f57d223db4f2cb5020246e6c31695c3fb3db0d78db13d266476e34e4e65";
const block = "0xc3687c87021f5b7855465caf6501b3f742f20f26b65cc7a107ff7a78f0b28b79";
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
        signedNewAttestation(publicKey, block, committee, slot),
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
                if (effect.args[0] === publicKey) next();
                else {
                    if (cases[index]) {
                        return mockBeaconBlockAttestations(
                            block,
                            effect.args[0],
                            committee,
                            cases[index].skipped,
                            cases[index].empty,
                        );
                    } else {
                        return mockBeaconBlockAttestations(block, effect.args[0], committee, false, true);
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
