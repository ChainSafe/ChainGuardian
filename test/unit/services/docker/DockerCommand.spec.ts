import {IDockerRunParams} from "../../../../src/renderer/services/docker/type";
import {Command} from "../../../../src/renderer/services/docker/command";

describe("DockerCommand unit tests", () => {
    // run command
    it("should check if docker run command generating properly", () => {
        const params: IDockerRunParams = {name: "test-image", image: "test-image"};
        params.cmd = "test-image-cmd";
        expect(Command.run(params)).toBe(`docker run --name ${params.name} test-image test-image-cmd`);
    });

    // ps command
    it("should check if docker ps command generating properly", () => {
        expect(Command.ps().trim()).toBe("docker ps -a");
        expect(Command.ps("test-container").trim()).toBe(
            "docker ps -a --no-trunc --filter name=^/test-container$"
        );
    });

    // version command
    it("should check if docker version command generating properly", () => {
        expect(Command.version()).toBe("docker -v");
    });

    // stop command
    it("should check if docker stop command generating properly", () => {
        expect(Command.stop("test-container")).toBe("docker stop test-container");
    });

    // start command
    it("should check if start command generating properly", () => {
        expect(Command.start("test-container")).toBe("docker start test-container");
    });

    // restart command
    it("should check if restart command generating properly", () => {
        expect(Command.restart("test-container")).toBe("docker restart test-container");
    });

    // logs command
    it("should check if logs command generating properly", () => {
        expect(Command.logs("test-container")).toBe("docker logs test-container");
        expect(Command.logs("test-container", true)).toBe("docker logs --follow test-container");
    });

    // kill command
    it("should check if restart command generating properly", () => {
        expect(Command.kill("test-container")).toBe("docker kill test-container");
    });
});
