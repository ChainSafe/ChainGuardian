import {partition} from "../../../src/renderer/services/utils/utils";

describe("utils unit tests", () => {
    it("should successfully split array based on condition.", async () => {
        expect(partition([1, 2, 5, 6, 8, 10], arg => arg > 5)).toStrictEqual([[6, 8, 10], [1, 2, 5]]);
        expect(partition([1, 2, 5], arg => arg < 0)).toStrictEqual([[], [1, 2, 5]]);
    });
});