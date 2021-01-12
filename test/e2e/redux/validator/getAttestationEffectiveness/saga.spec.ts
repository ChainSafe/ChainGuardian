import {testSaga} from "redux-saga-test-plan";
import {getAttestationEffectiveness} from "../../../../../src/renderer/ducks/validator/sagas";

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

describe("auth sagas", () => {
    it("authorize saga whit user in DB", () => {
        testSaga(getAttestationEffectiveness)
            .next()
            .put()
            .next()
            .isDone();
    });
});
