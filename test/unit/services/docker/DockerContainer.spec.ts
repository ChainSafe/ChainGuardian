import {Container} from "../../../../src/renderer/services/docker/container";
import {dockerPath} from "../../../../src/renderer/services/docker/path";
import * as cmdUtils from "../../../../src/renderer/services/utils/cmd";
import sinon from "sinon";

describe("docker container isDockerInstalled method unit tests", () => {
    let sandbox: sinon.SinonSandbox;
    beforeAll(async () => {
        sandbox = sinon.createSandbox();
        sandbox.stub(dockerPath, "getDockerBinary").resolves("docker");
    });

    afterAll(() => {
        sandbox.restore();
    });

    const runCmdStub = sinon.stub(cmdUtils, "runCmdAsync");

    it("should successfully check if docker is installed", async () => {
        runCmdStub.resolves({
            stdout: "docker version 12.02.2, build 21a1",
            stderr: "",
        });
        expect(await Container.isDockerInstalled()).toBeTruthy();
    });

    it("should successfully check if specific docker version is installed", async () => {
        runCmdStub.resolves({
            stdout: "docker version 12.02.2, build 21a1",
            stderr: "",
        });
        expect(await Container.isDockerInstalled("12.02.2")).toBeTruthy();
        expect(await Container.isDockerInstalled("13.02.2")).toBeFalsy();
    });

    it("should check if docker installed when docker is not installed", async () => {
        runCmdStub.resolves({
            stdout: "docker is not recognized as an internal or external command, operable program or batch file.",
            stderr: "",
        });
        expect(await Container.isDockerInstalled("11.02.2")).toBeFalsy();
    });
});
