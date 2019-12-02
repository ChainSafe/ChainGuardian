import {partition} from "../../../src/renderer/services/utils/utils";
import {passwordFormSchema} from "../../../src/renderer/containers/Onboard/CreatePassword/validation";
import {IState} from "../../../src/renderer/containers/Onboard/CreatePassword/CreatePasswordContainer";
import {joiValidationToErrorMessages} from "../../../src/renderer/services/validation/util";

describe("utils unit tests", () => {
    it("should successfully split array based on condition.", async () => {
        expect(partition([1, 2, 5, 6, 8, 10], arg => arg > 5)).toStrictEqual([[6, 8, 10], [1, 2, 5]]);
        expect(partition([1, 2, 5], arg => arg < 0)).toStrictEqual([[], [1, 2, 5]]);
    });
});