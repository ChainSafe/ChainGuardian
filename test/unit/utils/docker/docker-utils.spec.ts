import { extractDockerVersion } from '../../../../src/renderer/services/docker/utils';

describe("docker utils unit tests", () => {
    it("should successfully extract docker version.", async () => {
        expect(extractDockerVersion("docker version 12.7.1, build 420")).toBe("12.7.1");
        expect(extractDockerVersion("docker version 12.7.1")).toBe("12.7.1");
    }, 10000);

    it("should fail to extract docker version.", async () => {
        expect(extractDockerVersion("Version 12.7.1, build 420")).toBeNull();
        expect(extractDockerVersion("docker 12.7.1, build 420")).toBeNull();
    }, 10000);
});
