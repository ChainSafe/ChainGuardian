import {isPlatform, streamToString} from "../../../src/renderer/services/utils/cmd-utils";
import {ObjectReadableMock} from "stream-mock";

describe("cmd utils unit tests", () => {
    it("should successfully check current platform.", async () => {
        // change platform property
        const originalPlatform = Object.getOwnPropertyDescriptor(process, "platform");
        Object.defineProperty(process, "platform", {
            value: "linux"
        });
        // test
        expect(isPlatform("lin")).toBeTruthy();
        expect(isPlatform("win")).toBeFalsy();
        // reset platform property
        if (originalPlatform) {
            Object.defineProperty(process, "platform", originalPlatform);
        }
    });

    it("should successfully convert stream to string.", async () => {
        const stream = new ObjectReadableMock(["test", " ", "data"]);
        expect(await streamToString(stream)).toBe("test data");
    });
});
