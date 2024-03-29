import {IDockerRunParams} from "../../../../src/renderer/services/docker/type";
import {generateRunCommand} from "../../../../src/renderer/services/docker/utils";

describe("DockerRunParams unit tests", () => {
    it("should generate simple valid params for run command", () => {
        const params: IDockerRunParams = {image: "test-image", name: "test-image-name", memory: "300m"};
        expect(generateRunCommand(params).trim()).toBe(`--memory=300m --name ${params.name} test-image`);
    });

    it("should generate full valid params for run command", () => {
        const params: IDockerRunParams = {
            name: "test-image-name",
            detached: true,
            privileged: true,
            ipc: "none",
            restart: "always",
            publishAllPorts: true,
            image: "test-image",
            cmd: "ls",
            memory: "300m",
        };
        expect(generateRunCommand(params).trim()).toBe(
            `--memory=300m --name ${params.name} -d --privileged=true --ipc="none" --restart=always -P test-image ls`,
        );
    });
});
