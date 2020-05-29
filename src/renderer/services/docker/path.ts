import {runCmdAsync} from "../utils/cmd";
import {Command} from "./command";
import {extractDockerVersion} from "./utils";

class DockerPath {
    private defaultPaths = [
        "docker",
        "/usr/bin/docker",
        "/usr/local/bin/docker",
        "C:\Program Files\Docker Toolbox\docker.exe",
        "C:\Program Files\Docker\docker.exe",
        "C:\Program Files\Docker\Docker\resources\bin\docker.exe",
    ];

    private path: string;

    public async getPath(): Promise<string|null> {
        if (this.path) {
            return this.path;
        }

        for (let i = 0; i < this.defaultPaths.length; i ++) {
            try {
                const result = await runCmdAsync(await Command.version(this.defaultPaths[i]));
                if (extractDockerVersion(result.stdout)) {
                    this.path = this.defaultPaths[i];
                    return this.path;
                }
            } catch {
                // If all default paths are not working return null
                if (i === this.defaultPaths.length - 1) {
                    return null;
                }
            }
        }
    }
}

const dockerPath = new DockerPath();

export {
    dockerPath,
}
