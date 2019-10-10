import {IDockerRunParams} from "./IDockerRunParams";
import {DockerCommand} from "./DockerCommand";
import {runCmd, runCmdAsync} from "../utils/cmd-utils";
import * as logger from "electron-log";
import {Readable} from "stream";
import {extractDockerVersion} from "../utils/docker/docker-utils";

/**
 * Interface defining started docker instance.
 */
export interface IDocker {
    name: string;
    stdout?: Readable;
    stderr?: Readable;
    logs?: {
        stdout?: Readable;
        stderr?: Readable;
    };
}

/**
 * Abstract class providing basic operations with docker instance.
 *
 * Instance of @{DockerRunParams} is passed in constructor to define docker image that is going to be used.
 */
export abstract class DockerContainer {
    private docker: IDocker | null;
    private readonly params: IDockerRunParams;

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
            const cmdResult = await runCmdAsync(DockerCommand.version());
            // eslint-disable-next-line no-console
            console.log(cmdResult);
            const dockerVersion = extractDockerVersion(cmdResult.stdout);
            return version ? version === dockerVersion : !!dockerVersion;
        } catch (e) {
            logger.error(e);
            return false;
        }
    }

    /**
     * Runs docker instance defined trough constructor param.
     *
     * If docker instance already started this method will just reject promise.
     *
     * @param getLogs: boolean - if true return value will contain streams with docker instance logs.
     * @return instance of @{docker}
     */
    public async run(getLogs?: boolean): Promise<IDocker> {
        if (!this.docker) {
            if (!(await DockerContainer.isDockerInstalled())) {
                throw new Error("Unable to run instance because docker not installed.");
            }
            try {
                // start new docker instance
                const run = runCmd(DockerCommand.run(this.params));
                this.docker = {name: this.params.name, stdout: run.stdout, stderr: run.stderr};
                if (getLogs) {
                    // start tracking logs from docker instance
                    const logResult = runCmd(DockerCommand.logs(this.params.name));
                    this.docker.logs = {
                        stdout: logResult.stdout,
                        stderr: logResult.stderr
                    };
                }
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
                const cmdResult = await runCmdAsync(DockerCommand.ps(this.docker.name, "running"));
                // first line of output is header line, second line is definition of found docker instance
                const runningInstance = cmdResult.stdout.split("\n")[1];
                return runningInstance !== "";
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
                await runCmdAsync(DockerCommand.stop(this.docker.name));
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
                await runCmdAsync(DockerCommand.kill(this.docker.name));
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
                    runCmd(DockerCommand.restart(this.docker.name));
                } else {
                    // docker instance stopped, call start command
                    runCmd(DockerCommand.start(this.docker.name));
                }
                logger.info(`Docker instance ${this.docker.name} restared.`);
                return true;
            } catch (e) {
                logger.error(`Failed to restart docker instance ${this.docker.name} because ${e.message}.`);
            }
        }
        return false;
    }
}
