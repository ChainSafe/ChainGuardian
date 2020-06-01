import {dockerPath} from "./path";
import {IDockerRunParams} from "./type";
import {Command} from "./command";
import {ICmdRun, runCmd, runCmdAsync, runDetached} from "../utils/cmd";
import * as logger from "electron-log";
import {Readable} from "stream";
import {extractDockerVersion} from "./utils";

/**
 * Interface defining started docker instance.
 */
export interface IDocker {
    name: string;
    stdout?: Readable;
    stderr?: Readable;
}

/**
 * Abstract class providing basic operations with docker instance.
 *
 * Instance of @{DockerRunParams} is passed in constructor to define docker image that is going to be used.
 */
export abstract class Container {
    protected readonly params: IDockerRunParams;
    private docker: IDocker | null;

    protected constructor(params: IDockerRunParams) {
        this.docker = null;
        this.params = params;
    }

    /**
     * Checks if docker installed by calling docker -v to check for installed version.
     * If version param is provided, it also checks if installed version is matching one provided as argument.
     *
     * @param version - check if this specific version is installed.
     */
    public static async isDockerInstalled(version?: string): Promise<boolean> {
        try {
            if (!(await dockerPath.getDockerBinary())) {
                logger.info("Docker binary loading failed, Docker not found.");
                return false;
            }

            const cmdResult = await runCmdAsync(await Command.version());
            const dockerVersion = extractDockerVersion(cmdResult.stdout);
            return version ? version === dockerVersion : !!dockerVersion;
        } catch (e) {
            logger.error(e);
            return false;
        }
    }

    public static async isContainerRunning(name: string): Promise<boolean> {
        const cmdResult = await runCmdAsync(await Command.ps(name, "running"));
        // first line of output is header line, second line is definition of found docker instance
        const runningInstance = cmdResult.stdout.split("\n")[1];
        return runningInstance !== "";
    }

    public static async getImageName(dockerId: string): Promise<string|undefined> {
        const cmdResult = await runCmdAsync(await Command.ps(dockerId));
        const instance = cmdResult.stdout.split("\n")[1];
        if (instance) {
            const values = instance.split("   ");
            return values[1];
        }
    }

    public static async exists(name: string): Promise<boolean> {
        const cmdResult = (await runCmdAsync(Command.lsContainer())).stdout.split("\n");
        for (let i = 0 ; i < cmdResult.length; i++) {
            // check last column for name
            if (cmdResult[i].includes(name)) {
                return true;
            }
        }
        return false;
    }

    public async startStoppedContainer(): Promise<IDocker> {
        if (!(await Container.isContainerRunning(this.params.name))) {
            runCmd(await Command.start(this.params.name));
        }
        // Use the same way as docker run
        const logs = runCmd(await Command.logs(this.params.name, true));
        this.docker = {name: this.params.name, stdout: logs.stdout, stderr: logs.stderr};
        return this.docker;
    }

    public getName(): string | undefined {
        if (this.docker) {
            return this.docker.name;
        }
        return undefined;
    }

    public getLogs(): ICmdRun | undefined {
        if (this.docker) {
            return {
                stdout: this.docker.stdout,
                stderr: this.docker.stderr,
            } as ICmdRun;
        }
    }

    /**
     * Runs docker instance defined trough constructor param.
     *
     * If docker instance already started this method will just reject promise.
     *
     * @return instance of @{docker}
     */
    public async run(): Promise<IDocker> {
        if (!this.docker) {
            if (!(await Container.isDockerInstalled())) {
                throw new Error("Unable to run instance because docker not installed.");
            }
            try {
                // start new docker instance
                const run = runDetached(await Command.run(this.params));
                this.docker = {name: this.params.name, stdout: run.stdout, stderr: run.stderr};
                logger.info(`Docker instance ${this.docker.name} started.`);
                return this.docker;
            } catch (e) {
                logger.error(e);
                throw new Error(`Unable to run instance because ${e.message}.`);
            }
        } else {
            // docker instance already running
            logger.error(`Docker instance ${this.docker.name} already running.`);
            throw new Error(`Docker instance ${this.docker.name} already running.`);
        }
    }

    /**
     * Check if started docker instance is running.
     *
     * If instance never started with @{run()} this method will return false.
     *
     * @return - true if instance is running, false otherwise.
     */
    public async isRunning(): Promise<boolean> {
        if (this.docker && this.docker.name) {
            try {
                return Container.isContainerRunning(this.docker.name);
            } catch (e) {
                logger.error(`Failed to check if docker is running because ${e.message}.`);
            }
        }
        return false;
    }

    /**
     * Stops docker instance.
     *
     * If instance never started with @{run()} this method will return true.
     *
     * @return - true if docker instance is stopped, false otherwise.
     */
    public async stop(): Promise<boolean> {
        if (this.docker && this.docker.name) {
            try {
                await runCmdAsync(await Command.stop(this.docker.name));
                const stopped = !(await this.isRunning());
                if (stopped) {
                    logger.info(`Docker instance ${this.docker.name} stopped.`);
                }
                return stopped;
            } catch (e) {
                logger.error(`Failed to execute stop docker container ${this.docker.name} because ${e.message}.`);
            }
            return false;
        }
        return true;
    }

    /**
     * Send kill signal to main process in docker instance.
     *
     * If instance never started with @{run()} this method wont do anything.
     */
    public async kill(): Promise<void> {
        if (this.docker && this.docker.name) {
            try {
                await runCmdAsync(await Command.kill(this.docker.name));
                logger.info(`Docker instance ${this.docker.name} killed.`);
            } catch (e) {
                logger.error(`Failed to execute kill docker container ${this.docker.name} because ${e.message}.`);
            }
        }
        return;
    }

    /**
     * Restarts docker instance.
     *
     * If docker instance already stopped this function will call docker start command and
     * if instance is still running this function will call docker restart command.
     *
     * If instance never started with @{run()} this method will return false.
     *
     * @return - true if instance is restarted, false otherwise.
     */
    public async restart(): Promise<boolean> {
        if (this.docker && this.docker.name) {
            try {
                if (await this.isRunning()) {
                    // docker instance running, call restart command
                    runCmd(await Command.restart(this.docker.name));
                } else {
                    // docker instance stopped, call start command
                    runCmd(await Command.start(this.docker.name));
                }
                logger.info(`Docker instance ${this.docker.name} restared.`);
                return true;
            } catch (e) {
                logger.error(`Failed to restart docker instance ${this.docker.name} because ${e.message}.`);
            }
        }
        return false;
    }

    public async remove(): Promise<boolean> {
        if (this.docker && this.docker.name) {
            try {
                runCmd(Command.removeContainer(this.docker.name));
                logger.info(`Docker container ${this.docker.name} removed.`);
                return true;
            } catch (e) {
                logger.error(`Failed to remove docker container ${this.docker.name} because ${e.message}.`);
            }
        }
        return false;
    }
}
