import {dockerPath} from "../../../../src/renderer/services/docker/path";
import {IDockerRunParams} from "../../../../src/renderer/services/docker/type";
import {Command} from "../../../../src/renderer/services/docker/command";
import sinon from "sinon";

describe("DockerCommand unit tests", () => {
    let sandbox: sinon.SinonSandbox;
    beforeAll(async () => {
        sandbox = sinon.createSandbox();
        sandbox.stub(dockerPath, "getPath").resolves("docker");
    });

    afterAll(() => {
        sandbox.restore();
    });

    // run command
    it("should check if docker run command generating properly", async () => {
        const params: IDockerRunParams = {name: "test-image", image: "test-image"};
        params.cmd = "test-image-cmd";
        expect(await Command.run(params)).toBe(`"docker" run --name ${params.name} test-image test-image-cmd`);
    });

    // ps command
    it("should check if docker ps command generating properly", async () => {
        expect((await Command.ps()).trim()).toBe(`"docker" ps -a`);
        expect((await Command.ps("test-container")).trim()).toBe(
            `"docker" ps -a --no-trunc --filter name=^/test-container$`,
        );
    });

    // version command
    it("should check if docker version command generating properly", async () => {
        expect(await Command.version()).toBe(`"docker" -v`);
    });

    // stop command
    it("should check if docker stop command generating properly", async () => {
        expect(await Command.stop("test-container")).toBe(`"docker" stop test-container`);
    });

    // start command
    it("should check if start command generating properly", async () => {
        expect(await Command.start("test-container")).toBe(`"docker" start test-container`);
    });

    // restart command
    it("should check if restart command generating properly", async () => {
        expect(await Command.restart("test-container")).toBe(`"docker" restart test-container`);
    });

    // logs command
    it("should check if logs command generating properly", async () => {
        expect(await Command.logs("test-container")).toBe(`"docker" logs test-container`);
        expect(await Command.logs("test-container", true)).toBe(`"docker" logs --follow test-container`);
    });

    // kill command
    it("should check if restart command generating properly", async () => {
        expect(await Command.kill("test-container")).toBe(`"docker" kill test-container`);
    });
});
