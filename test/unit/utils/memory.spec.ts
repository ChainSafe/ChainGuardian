import {memoryNumberToString, memoryStringToNumber} from "../../../src/renderer/services/utils/memory";

describe("memory utils", function () {
    const m = [
        {s: "323 B", n: 323},
        {s: "342 kB", n: 350208},
        {s: "321.2 MB", n: 336802611},
        {s: "12 GB", n: 12884901888},
        {s: "6.3 TB", n: 6926923254988},
        {s: "1.2 PB", n: 1351079888211148},
    ];
    const i = [
        {s: "200 B", n: 200},
        {s: "321 KiB", n: 321000},
        {s: "22.3 MiB", n: 22300000},
        {s: "4 GiB", n: 4000000000},
        {s: "8.22 TiB", n: 8220000000000},
        {s: "3 PiB", n: 3000000000000000},
    ];

    it("memoryNumberToString", function () {
        for (const mt of m) {
            expect(memoryNumberToString(mt.n)).toEqual(mt.s);
        }
        for (const mI of i) {
            expect(memoryNumberToString(mI.n, true)).toEqual(mI.s);
        }
    });

    it("memoryStringToNumber", function () {
        for (const mt of m) {
            expect(memoryStringToNumber(mt.s)).toEqual(mt.n);
        }
        for (const mI of i) {
            expect(memoryStringToNumber(mI.s)).toEqual(mI.n);
        }
    });
});
