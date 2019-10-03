import { DockerRunParams } from '../Utils/Docker/DockerRunParams';
import { DockerCommand } from '../Utils/Docker/DockerCommand';
import { runCmd, runCmdAsync } from '../Utils/cmd-utils';
import * as logger from 'electron-log';
import { Readable } from 'stream';
import { extractDockerVersion } from '../Utils/Docker/docker-utils';

/**
 * Interface defining started docker instance.
 */
export interface Docker {
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
    private docker: Docker | null;
    private readonly params: DockerRunParams;

    protected constructor(params: DockerRunParams) {
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
     * @return instance of @{Docker}
     */
    public async run(getLogs?: boolean): Promise<Docker> {
        return new Promise(async (resolve, reject) => {
            if (!this.docker) {
                if (!(await DockerContainer.isDockerInstalled())) {
                    reject('Docker not installed.');
                }
                try {
                    // start new docker instance
                    const run = runCmd(DockerCommand.run(this.params));
                    this.docker = { name: this.params.name, stdout: run.stdout, stderr: run.stderr };
                    if (getLogs) {
                        // start tracking logs from docker instance
                        const logResult = runCmd(DockerCommand.logs(this.params.name));
                        this.docker.logs = {
                            stdout: logResult.stdout,
                            stderr: logResult.stderr
                        };
                    }
                    logger.info(`Docker instance ${this.docker.name} started.`);
                    resolve(this.docker);
                } catch (e) {
                    logger.error(e);
                    reject(e);
                }
            } else {
                // Docker instance already running
                logger.error(`Docker instance ${this.docker.name} already running`);
                reject(`Docker instance ${this.docker.name} already running`);
            }
        });
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
                const cmdResult = await runCmdAsync(DockerCommand.ps(this.docker.name, 'running'));
                return cmdResult.stdout.split('\n')[1] !== '';
            } catch (e) {
                logger.error(e);
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
                logger.error(`Failed to execute stop docker container ${this.docker.name}`, e);
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
                logger.error(`Failed to execute kill docker container ${this.docker.name}`, e);
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
                    // Docker instance running, call restart command
                    runCmd(DockerCommand.restart(this.docker.name));
                } else {
                    // Docker instance stopped, call start command
                    runCmd(DockerCommand.start(this.docker.name));
                }
                logger.info(`Docker instance ${this.docker.name} restared.`);
                return true;
            } catch (e) {
                logger.error(e);
            }
        }
        return false;
    }
}
