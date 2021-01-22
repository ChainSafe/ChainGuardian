import {expectSaga, TestApi, testSaga} from "redux-saga-test-plan";
import {getAttestationEffectiveness} from "../../../../../src/renderer/ducks/validator/sagas";
import {signedNewAttestation} from "../../../../../src/renderer/ducks/validator/actions";
import {getValidator} from "../../../../../src/renderer/ducks/validator/selectors";
import {V4Keystore} from "../../../../../src/renderer/services/keystore";
import {IValidatorComplete} from "../../../../../src/renderer/ducks/validator/slice";
import {ValidatorStatus} from "../../../../../src/renderer/constants/validatorStatus";
import {updateSlot} from "../../../../../src/renderer/ducks/beacon/actions";
import {mockBeaconBlockAttestations} from "./mockBeaconBlockAttestations";
import {CgEth2ApiClient} from "../../../../../src/renderer/services/eth2/client/eth2ApiClient";
import {mainnetConfig} from "@chainsafe/lodestar-config/lib/presets/mainnet";

/** test koraci koji moraju biti pokriveni
 * "normalne" situacije
 * - () kad je sve uredu i u iducem bloku se moze vidjet atterstatcija (Effectiveness 1)
 * - () kad je sve uredu ali nemoze se pronac atterstatcija (Effectiveness 1)
 * - () kad atterstatcija upisana 2 blok bez praznog bloka izmedu (Effectiveness 0.5)
 * - () kad atterstatcija upisana 3 blok bez praznog bloka izmedu (Effectiveness 0.333)
 * - () kad atterstatcija upisana 2 blok sa preskocenim 1 blokom (Effectiveness 1)
 * - () kad atterstatcija upisana 3 blok sa preskocenim 2 blokom (Effectiveness 1)
 * - () kad atterstatcija upisana 3 blok sa preskocenim 1 blokom (Effectiveness 0.66)
 *      - () sticuacija kad se preskoceni blok odma nalazi na prvom mjestu
 *      - () sticuacija kad se preskoceni blok nalazi bloku prije upisivanja
 * - () kad atterstatcija upisana 4 blok sa preskocenim 2 blokom (Effectiveness 0.75)
 *      - () sticuacija kad se preskocene blokovi odma nalazi na pocetku (start, null, null, miss, atter)
 *      - () sticuacija kad se preskocene blokovi nalaze na kraju (start, miss, null, null, atter)
 *      - () sticuacija kad se preskocene blok nalazi na pocetku i kraju (start, null, miss, null, atter)
 * "rubne" situacije
 * - () kad atterstatcija upisana 5 blok a izmedu se nalaze nekolicina blokovi bez informacije o atterstatciji
 *      - () tipa (start, empty, empty, empty, miss, atter)
 *      - () tipa (start, miss, empty, empty, empty, atter)
 *      - () tipa (start, empty, empty, empty, null, atter)
 * - () kad atterstatcija upisana 16 blok bez praznog bloka izmedu (Effectiveness 0.09)
 * - () kad atterstatcija upisana 10 blok sa preskocenim 4 blokom (Effectiveness 0.4)
 *     - () sticuacija kad se preskocene blokovi odma nalazi na pocetku
 *     - () sticuacija kad se preskocene blokovi nalaze na kraju
 *     - () situacija kad su preskoceni blokovi pomjesani
 *          - () izmedu svakog bloka se nalazi preskoceni blok (srt, mis, nul, mis, nul, mis, nul, mis, nul, mis, end)
 *          - () vise grupirani blokovi - npr (srt, mis, mis, nul, nul, mis, nul, mis, mis, nul, end)
 * nakon svakog testa potrebo je i testirat situacije koje se pojavljuju radi nacina kako je implementirano
 *  - () sve super kad ostali blokovi ne posjeduju iformacije o atterstatciji
 *  - () blokovi posjeduju iformacije o atterstatciji jos kroz par blokova
 *  - () kad nakon zadnjeg poznatog bloka nalazi se preskocena atterstatcija tipa (...end, null, null, empty...)
 * */

const publicKey = "0x9331f1ec6672748ca7b080faff7038da35838f57d223db4f2cb5020246e6c31695c3fb3db0d78db13d266476e34e4e65";
// todo sync with mock data...
const block = "0xc3687c87021f5b7855465caf6501b3f742f20f26b65cc7a107ff7a78f0b28b79";
const index = 11;
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

const AFTER_INITIALIZATION = "afterInitialization";

describe("getAttestationEffectiveness", () => {
    let saga: TestApi;

    beforeEach(() => {
        saga = testSaga(getAttestationEffectiveness, signedNewAttestation(publicKey, block, index, slot));
        saga.next().select(getValidator, {publicKey}).next(selectedValidator).save(AFTER_INITIALIZATION);
    });

    afterEach(() => {
        saga.restore(AFTER_INITIALIZATION);
    });

    it("#1", async () => {
        saga.next(updateSlot(slot + 1, "http://localhost:5052"))
            .next([mockBeaconBlockAttestations(block, slot + 1, index, false, true)])
            .next(updateSlot(slot + 3, "http://localhost:5052"))
            .next([
                mockBeaconBlockAttestations(block, slot + 2, index, false, true),
                mockBeaconBlockAttestations(block, slot + 3, index, false, true),
            ])
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .inspect<any>((i1) => {
                // console.warn("i1", i1);
                // console.warn("i1", i1.payload);
                // console.warn("i1", i1.payload.args);
                // console.warn("i1", i1.payload.args[1]);
            })
            .next();
        // .isDone();

        const eth2API = new CgEth2ApiClient(mainnetConfig, "http://localhost:5052");

        let tempSlot = slot;
        const a = await expectSaga(getAttestationEffectiveness, signedNewAttestation(publicKey, block, index, slot))
            .provide({
                select: () => selectedValidator,
                take: () => {
                    tempSlot++;
                    return updateSlot(tempSlot, "http://localhost:5052");
                },
                call: (effect, next) => {
                    if (effect.args[0] !== publicKey)
                        return mockBeaconBlockAttestations(block, effect.args[0], index, false, true);
                    next();
                },
            })
            .run(false);

        console.log(a.effects.call[a.effects.call.length - 1]);
    });
});
