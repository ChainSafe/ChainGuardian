import database from "../db/api/database";

import {runCmdAsync} from "../utils/cmd";
import {Command} from "./command";
import {extractDockerVersion} from "./utils";
import {chainGuardianLogger} from "../../../main/logger";

export class DockerPath {
    private defaultPaths = [
        "docker",
        "/usr/bin/docker",
        "/usr/local/bin/docker",
        "C:\\Program Files\\Docker Toolbox\\docker.exe",
        "C:\\Program Files\\Docker\\docker.exe",
        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe",
    ];

    private path: string;

    public static async isValidPath(path: string): Promise<boolean> {
        try {
            const result = await runCmdAsync(await Command.version(path));
            return !!extractDockerVersion(result.stdout);
        } catch (e) {
            chainGuardianLogger.warn(`Error while checking if Docker path is valid: ${e.message}`);
            return false;
        }
    }

    public async getPath(): Promise<string> {
        if (this.path) {
            return this.path;
        }

        const loadedPath = await this.getDockerBinary();
        if (loadedPath) {
            return loadedPath;
        }

        throw new Error("Docker path is not set.");
    }

    public async getDefaultBinary(): Promise<string | undefined> {
        for (let i = 0; i < this.defaultPaths.length; i++) {
            if (await DockerPath.isValidPath(this.defaultPaths[i])) {
                chainGuardianLogger.info(`Found Docker at default path: ${this.defaultPaths[i]}`);
                return this.defaultPaths[i];
            }
        }
    }

    public async getDockerBinary(): Promise<string | null> {
        const settings = await database.settings.get();
        // Check first if path is saved in db and valid
        if (settings && settings.dockerPath && DockerPath.isValidPath(settings.dockerPath)) {
            chainGuardianLogger.info(`Found valid Docker path: ${settings.dockerPath}`);
            this.path = settings.dockerPath;
            return this.path;
        }

        const foundDefaultPath = await this.getDefaultBinary();
        if (foundDefaultPath) {
            this.path = foundDefaultPath;
            await database.settings.set(undefined, {
                dockerPath: foundDefaultPath,
            });
            chainGuardianLogger.info("Saved Docker path in settings db.");
            return this.path;
        }

        return null;
    }
}

const dockerPath = new DockerPath();

export {dockerPath};
