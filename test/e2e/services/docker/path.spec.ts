// run docker e2e test suit if env variable set
import {dockerPath} from "../../../../src/renderer/services/docker/path";
import {assert} from "chai";

if (process.env["RUN_DOCKER_TESTS"] === "yes") describe("docker path e2e tests", tests);
else describe.skip("skipping docker container e2e tests", tests);

function tests(): void {
    it("should find a working default binary", async () => {
        const path = await dockerPath.getDefaultBinary();
        assert.isNotNull(path, "path should not be null");
    });
}
