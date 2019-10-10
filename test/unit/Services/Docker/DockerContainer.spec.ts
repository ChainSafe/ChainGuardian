import {DockerContainer} from "../../../../src/renderer/services/docker/DockerContainer";
import * as cmdUtils from "../../../../src/renderer/services/utils/cmd-utils";
import * as sinon from "sinon";

describe("docker container isDockerInstalled method unit tests", () => {
    const runCmdStub = sinon.stub(cmdUtils, "runCmdAsync");

    it("should successfully check if docker is installed", async () => {
        runCmdStub.resolves({
            stdout: "Docker version 12.02.2, build 21a1",
            stderr: ""
        });
        expect(await DockerContainer.isDockerInstalled()).toBeTruthy();
    });

    it("should successfully check if specific docker version is installed", async () => {
        runCmdStub.resolves({
            stdout: "Docker version 12.02.2, build 21a1",
            stderr: ""
        });
        expect(await DockerContainer.isDockerInstalled("12.02.2")).toBeTruthy();
        expect(await DockerContainer.isDockerInstalled("13.02.2")).toBeFalsy();
    });

    it("should check if docker installed when docker is not installed", async () => {
        runCmdStub.resolves({
            stdout: "docker is not recognized as an internal or external command, operable program or batch file.",
            stderr: ""
        });
        expect(await DockerContainer.isDockerInstalled("11.02.2")).toBeFalsy();
    });
});
