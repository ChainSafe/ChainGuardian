import logger from "electron-log";
import database from "../db/api/database";

import {runCmdAsync} from "../utils/cmd";
import {Command} from "./command";
import {extractDockerVersion} from "./utils";

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
            logger.warn(`Error while checking if Docker path is valid: ${e.message}`);
            return false;
        }
    }

    public async getPath(): Promise<string> {
        if (this.path) {
            return this.path;
        }

        const loadedPath = await this.loadPath();
        if (loadedPath) {
            return loadedPath;
        }

        throw new Error("Docker path is not set.");
    }

    public async findPath(): Promise<string|undefined> {
        return this.defaultPaths.find((path) => {
            if (DockerPath.isValidPath(path)) {
                this.path = path;
                return this.path;
            }
        });
    }

    public async loadPath(): Promise<string|null> {
        const settings = await database.settings.get();
        // Check first if path is saved in db and valid
        if (settings && settings.dockerPath && DockerPath.isValidPath(settings.dockerPath)) {
            logger.info(`Found valid Docker path: ${settings.dockerPath}`);
            this.path = settings.dockerPath;
            return this.path;
        }

        const foundDefaultPath = await this.findPath();
        if (foundDefaultPath) {
            logger.info(`Found Docker at path: ${foundDefaultPath}`);
            this.path = foundDefaultPath;
            await database.settings.set(undefined, {
                dockerPath: foundDefaultPath
            });
            logger.info("Saved Docker path in settings db.");
            return this.path;
        }

        return null;
    }
}

const dockerPath = new DockerPath();

export {
    dockerPath,
};
