import {testAttestationEffectivenessSaga} from "./testAttestationEffectivenessSaga";

// TODO: manually validate tests
describe("getAttestationEffectiveness", () => {
    /** Usual case for attestation */
    it(
        "attestation is visible in next block",
        testAttestationEffectivenessSaga([{slotOffset: 1, skipped: false, empty: false}], {
            efficiency: 1,
            inclusionOffset: 1,
        }),
    );
    it(
        "attestation is not visible in next block, but its attested is included",
        testAttestationEffectivenessSaga([], {
            efficiency: 1,
            inclusionOffset: 1,
        }),
    );
    it(
        "attestation including slot is +2",
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
        "attestation including slot is +3",
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
    describe("attestation is visible in next not skipped block", () => {
        it(
            "1 block skipped",
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
            "2 block skipped",
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
        it(
            "4 block skipped",
            testAttestationEffectivenessSaga(
                [
                    {slotOffset: 1, skipped: true, empty: false},
                    {slotOffset: 2, skipped: true, empty: false},
                    {slotOffset: 3, skipped: true, empty: false},
                    {slotOffset: 4, skipped: true, empty: false},
                    {slotOffset: 5, skipped: false, empty: false},
                ],
                {
                    efficiency: 1,
                    inclusionOffset: 4,
                },
            ),
        );
    });
    describe("attestation is visible in 3th block block and 1 skipped block", () => {
        it(
            "skipped 1st block",
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
            "skipped last block",
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
    describe("attestation is visible in 4th block block and 2 skipped block", () => {
        it(
            "first 2 block are skipped",
            testAttestationEffectivenessSaga(
                [
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
            "last 2 block are skipped",
            testAttestationEffectivenessSaga(
                [
                    {slotOffset: 1, skipped: false, empty: false},
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
            "middle block is not skipped",
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

    /** Unusual case for attestation */
    it(
        "attestation including slot is +16",
        testAttestationEffectivenessSaga(
            new Array(17).fill(null).map((_, index) => ({slotOffset: index + 1, skipped: false, empty: false})),
            {
                efficiency: 0.0625,
                inclusionOffset: 16,
            },
        ),
    );
    describe("attestation is visible in 10th block block and 4 skipped block", () => {
        it(
            "first 4 block are skipped",
            testAttestationEffectivenessSaga(
                [
                    {slotOffset: 4, skipped: true, empty: false},
                    {slotOffset: 10, skipped: false, empty: false},
                    {slotOffset: 11, skipped: false, empty: false},
                ],
                {
                    efficiency: 0.5,
                    inclusionOffset: 10,
                },
            ),
        );
        it(
            "last 4 block are skipped",
            testAttestationEffectivenessSaga(
                [
                    {slotOffset: 5, skipped: false, empty: false},
                    {slotOffset: 9, skipped: true, empty: false},
                    {slotOffset: 10, skipped: false, empty: false},
                    {slotOffset: 11, skipped: false, empty: false},
                ],
                {
                    efficiency: 0.5,
                    inclusionOffset: 10,
                },
            ),
        );
        it(
            "every 2nd block are skipped",
            testAttestationEffectivenessSaga(
                [
                    {slotOffset: 1, skipped: false, empty: false},
                    {slotOffset: 2, skipped: true, empty: false},
                    {slotOffset: 3, skipped: false, empty: false},
                    {slotOffset: 4, skipped: true, empty: false},
                    {slotOffset: 5, skipped: false, empty: false},
                    {slotOffset: 6, skipped: true, empty: false},
                    {slotOffset: 7, skipped: false, empty: false},
                    {slotOffset: 8, skipped: true, empty: false},
                    {slotOffset: 9, skipped: false, empty: false},
                    {slotOffset: 10, skipped: false, empty: false},
                    {slotOffset: 11, skipped: false, empty: false},
                ],
                {
                    efficiency: 0.5,
                    inclusionOffset: 10,
                },
            ),
        );
        it(
            "skipped blocks are grouped",
            testAttestationEffectivenessSaga(
                [
                    {slotOffset: 1, skipped: false, empty: false},
                    {slotOffset: 3, skipped: true, empty: false},
                    {slotOffset: 6, skipped: false, empty: false},
                    {slotOffset: 8, skipped: true, empty: false},
                    {slotOffset: 9, skipped: false, empty: false},
                    {slotOffset: 10, skipped: false, empty: false},
                    {slotOffset: 11, skipped: false, empty: false},
                ],
                {
                    efficiency: 0.5,
                    inclusionOffset: 10,
                },
            ),
        );
    });
    describe("attestation is visible in 5th block block with different cases (skipped, empty, missed)", () => {
        // TODO: add more obscure cases
        it(
            "3 block are empty and 1 is skipped",
            testAttestationEffectivenessSaga(
                [
                    {slotOffset: 1, skipped: false, empty: true},
                    {slotOffset: 2, skipped: true, empty: false},
                    {slotOffset: 4, skipped: false, empty: true},
                    {slotOffset: 5, skipped: false, empty: false},
                    {slotOffset: 6, skipped: false, empty: false},
                ],
                {
                    efficiency: 0.4,
                    inclusionOffset: 5,
                },
            ),
        );
        it(
            "3 block are empty and 1 is missed",
            testAttestationEffectivenessSaga(
                [
                    {slotOffset: 1, skipped: false, empty: true},
                    {slotOffset: 2, skipped: false, empty: false},
                    {slotOffset: 4, skipped: false, empty: true},
                    {slotOffset: 5, skipped: false, empty: false},
                    {slotOffset: 6, skipped: false, empty: false},
                ],
                {
                    efficiency: 0.2,
                    inclusionOffset: 5,
                },
            ),
        );
    });
});
