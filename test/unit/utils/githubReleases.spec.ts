import {isCurrentOrNewerVersion} from "../../../src/renderer/services/utils/githubReleases";

describe("GitHub Releases", () => {
    describe("isCurrentOrNewerVersion", () => {
        it("test with 'v' prefix", () => {
            expect(isCurrentOrNewerVersion("v1.3.2", "v1.3.2")).toBeTruthy();
            expect(isCurrentOrNewerVersion("v1.3.2", "v1.3.2")).toBeTruthy();
            expect(isCurrentOrNewerVersion("v1.3.2", "v2.3.2")).toBeTruthy();
            expect(isCurrentOrNewerVersion("v1.3.2", "v2.1.2")).toBeTruthy();
            expect(isCurrentOrNewerVersion("v1.3", "v1.3.0")).toBeTruthy();
            expect(isCurrentOrNewerVersion("v1.3", "v1.3.3")).toBeTruthy();

            expect(isCurrentOrNewerVersion("v1.3.2", "v1.3.1")).toBeFalsy();
            expect(isCurrentOrNewerVersion("v1.3.2", "v1.3")).toBeFalsy();
            expect(isCurrentOrNewerVersion("v1.3.2", "v0.2.1")).toBeFalsy();
        });

        it("test without v prefix", () => {
            expect(isCurrentOrNewerVersion("1.3.2", "1.3.2")).toBeTruthy();
            expect(isCurrentOrNewerVersion("1.3.2", "1.3.2")).toBeTruthy();
            expect(isCurrentOrNewerVersion("1.3.2", "2.3.2")).toBeTruthy();
            expect(isCurrentOrNewerVersion("1.3.2", "2.1.2")).toBeTruthy();
            expect(isCurrentOrNewerVersion("1.3", "1.3.0")).toBeTruthy();
            expect(isCurrentOrNewerVersion("1.3", "1.3.3")).toBeTruthy();

            expect(isCurrentOrNewerVersion("1.3.2", "1.3.1")).toBeFalsy();
            expect(isCurrentOrNewerVersion("1.3.2", "1.3")).toBeFalsy();
            expect(isCurrentOrNewerVersion("1.3.2", "0.2.1")).toBeFalsy();
        });
    });
});
