/** test koraci koji moraju biti pokriveni
 * "normalne" situacije
 * - (1) kad je sve uredu i u iducem bloku se moze vidjet atterstatcija (Effectiveness 1)
 * - (2) kad je sve uredu ali nemoze se pronac atterstatcija (Effectiveness 1)
 * - (3) kad atterstatcija upisana 2 blok bez praznog bloka izmedu (Effectiveness 0.5)
 * - (4) kad atterstatcija upisana 3 blok bez praznog bloka izmedu (Effectiveness 0.333)
 * - (5?) kad atterstatcija upisana 2 blok sa preskocenim 1 blokom (Effectiveness 1)
 * - (6?) kad atterstatcija upisana 3 blok sa preskocenim 2 blokom (Effectiveness 1)
 * - (7?) kad atterstatcija upisana 3 blok sa preskocenim 1 blokom (Effectiveness 0.66)
 *      - (_1) sticuacija kad se preskoceni blok odma nalazi na prvom mjestu
 *      - (_2) sticuacija kad se preskoceni blok nalazi bloku prije upisivanja
 * - (8?) kad atterstatcija upisana 4 blok sa preskocenim 2 blokom (Effectiveness 0.75)
 *      - (_1) sticuacija kad se preskocene blokovi odma nalazi na pocetku (start, null, null, miss, atter)
 *      - (_2) sticuacija kad se preskocene blokovi nalaze na kraju (start, miss, null, null, atter)
 *      - (_3) sticuacija kad se preskocene blok nalazi na pocetku i kraju (start, null, miss, null, atter)
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

import {testAttestationEffectivenessSaga} from "./testAttestationEffectivenessSaga";

describe("getAttestationEffectiveness", () => {
    it(
        "#1",
        testAttestationEffectivenessSaga([{slotOffset: 1, skipped: false, empty: false}], {
            efficiency: 1,
            inclusionOffset: 1,
        }),
    );
    it(
        "#2",
        testAttestationEffectivenessSaga([], {
            efficiency: 1,
            inclusionOffset: 1,
        }),
    );
    it(
        "#3",
        testAttestationEffectivenessSaga(
            [
                {slotOffset: 1, skipped: false, empty: false},
                {slotOffset: 2, skipped: false, empty: false},
                {slotOffset: 3, skipped: false, empty: false},
            ],
            {
                efficiency: 0.5,
                inclusionOffset: 2,
            },
        ),
    );
    it(
        "#4",
        testAttestationEffectivenessSaga(
            [
                {slotOffset: 1, skipped: false, empty: false},
                {slotOffset: 2, skipped: false, empty: false},
                {slotOffset: 3, skipped: false, empty: false},
                {slotOffset: 4, skipped: false, empty: false},
            ],
            {
                efficiency: 0.3333333333333333,
                inclusionOffset: 3,
            },
        ),
    );
    it(
        "#5",
        testAttestationEffectivenessSaga(
            [
                {slotOffset: 1, skipped: true, empty: false},
                {slotOffset: 2, skipped: false, empty: false},
            ],
            {
                efficiency: 1,
                inclusionOffset: 1,
            },
        ),
    );
    it(
        "#6",
        testAttestationEffectivenessSaga(
            [
                {slotOffset: 1, skipped: true, empty: false},
                {slotOffset: 2, skipped: true, empty: false},
                {slotOffset: 3, skipped: false, empty: false},
            ],
            {
                efficiency: 1,
                inclusionOffset: 2,
            },
        ),
    );
    describe("#7", () => {
        it(
            "_1",
            testAttestationEffectivenessSaga(
                [
                    {slotOffset: 1, skipped: true, empty: false},
                    {slotOffset: 2, skipped: false, empty: false},
                    {slotOffset: 3, skipped: false, empty: false},
                    {slotOffset: 4, skipped: false, empty: false},
                ],
                {
                    efficiency: 0.6666666666666666,
                    inclusionOffset: 3,
                },
            ),
        );
        it(
            "_2",
            testAttestationEffectivenessSaga(
                [
                    {slotOffset: 1, skipped: false, empty: false},
                    {slotOffset: 2, skipped: true, empty: false},
                    {slotOffset: 3, skipped: false, empty: false},
                    {slotOffset: 4, skipped: false, empty: false},
                ],
                {
                    efficiency: 0.6666666666666666,
                    inclusionOffset: 3,
                },
            ),
        );
    });
    describe("#7", () => {
        it(
            "_1",
            testAttestationEffectivenessSaga(
                [
                    {slotOffset: 1, skipped: true, empty: false},
                    {slotOffset: 2, skipped: true, empty: false},
                    {slotOffset: 3, skipped: false, empty: false},
                    {slotOffset: 4, skipped: false, empty: false},
                    {slotOffset: 5, skipped: false, empty: false},
                ],
                {
                    efficiency: 0.75,
                    inclusionOffset: 4,
                },
            ),
        );
        it(
            "_2",
            testAttestationEffectivenessSaga(
                [
                    {slotOffset: 1, skipped: false, empty: false},
                    {slotOffset: 2, skipped: true, empty: false},
                    {slotOffset: 3, skipped: true, empty: false},
                    {slotOffset: 4, skipped: false, empty: false},
                    {slotOffset: 5, skipped: false, empty: false},
                ],
                {
                    efficiency: 0.75,
                    inclusionOffset: 4,
                },
            ),
        );
        it(
            "_3",
            testAttestationEffectivenessSaga(
                [
                    {slotOffset: 1, skipped: true, empty: false},
                    {slotOffset: 2, skipped: false, empty: false},
                    {slotOffset: 3, skipped: true, empty: false},
                    {slotOffset: 4, skipped: false, empty: false},
                    {slotOffset: 5, skipped: false, empty: false},
                ],
                {
                    efficiency: 0.75,
                    inclusionOffset: 4,
                },
            ),
        );
    });
});
