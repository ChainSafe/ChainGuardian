import { IService } from '../Services/interface';
import { DockerRunParams } from '../Utils/Docker/DockerRunParams';
import { DockerCommand } from '../Utils/Docker/DockerCommand';
import { isPlatform, runCmd } from '../Utils/cmd-utils';
import * as logger from 'electron-log';
import { Readable } from 'stream';
import { extractDockerVersion } from '../Utils/Docker/docker-utils';

/**
 * Interface defining started docker instance.
 */
export interface Docker {
    running: boolean;
    name: string;
    pid: number;
    stdout?: Readable;
    stderr?: Readable;
}

export abstract class DockerContainer {
    private docker: Docker | null;
    private readonly params: DockerRunParams;

    protected constructor(params: DockerRunParams) {
        this.docker = null;
        this.params = params;
    }

    /**
     * Checks if docker installed by calling docker -v to check for installed version.
     * If version param is provided, it also checks if installed version is matching.
     *
     * @param version - check if this specific version is installed.
     */
    public static async isDockerInstalled(version?: string): Promise<boolean> {
        try {
            const cmdResult = await runCmd(DockerCommand.version());
            if (cmdResult.stdout instanceof Readable) {
                return false;
            }
            const dockerVersion = extractDockerVersion(cmdResult.stdout);
            return version ? version === dockerVersion : !!dockerVersion;
        } catch (e) {
            logger.error(e);
            return false;
        }
    }

    /**
     * Runs docker instance defined by provided argument.
     * If docker instance already started this method will just reject promise.
     *
     * @param params - instance of @{DockerRunParams}
     * @return Promise<Docker> - details about docker instance started
     */
    public async run(): Promise<Docker> {
        if (!(await DockerContainer.isDockerInstalled())) {
            throw new Error('Docker not installed.');
        }
        return new Promise(async (resolve, reject) => {
            if (!this.docker) {
                try {
                    // start new docker instance
                    const cmdResult = await runCmd(DockerCommand.run(this.params));
                    if (cmdResult.stderr) {
                        // check if error occurred
                        logger.error(
                            `Error on starting ${this.params.name} docker instance from image ${this.params.image}`,
                            cmdResult.stderr
                        );
                        reject(cmdResult.stderr);
                    }
                    this.docker = { running: true, name: this.params.name, pid: cmdResult.pid };
                    // start tracking logs from docker instance
                    const logResult = await runCmd(DockerCommand.logs(this.params.name, true), true);
                    if (logResult.stdout instanceof Readable && logResult.stderr instanceof Readable) {
                        this.docker.stdout = logResult.stdout;
                        this.docker.stderr = logResult.stderr;
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
                reject();
            }
        });
    }

    /**
     * Check if started docker instance is running.
     * If instance never started with @{runDockerInstance()} this method will return false.
     */
    public async isDockerInstanceRunning(): Promise<boolean> {
        try {
            if (this.docker && this.docker.name) {
                // docker instance not stopped programmatically
                if (this.docker.running) {
                    const cmdResult = await runCmd(DockerCommand.ps(this.docker.name, 'running'));
                    if (cmdResult.stdout instanceof Readable) {
                        return false;
                    }
                    return cmdResult.stdout.split('\n')[1] !== '';
                }
                // docker instance stopped programmatically
                return this.docker.running;
            }
        } catch (e) {
            logger.error(e);
        }
        return false;
    }

    /**
     * Stops docker instance if running.
     */
    public async stopDockerInstance(): Promise<boolean> {
        if (this.docker && this.docker.name) {
            try {
                await runCmd(DockerCommand.stop(this.docker.name));
                this.docker.running = false;
                return true;
            } catch (e) {
                logger.error(e);
            }
        }
        return false;
    }

    /**
     * Send kill signal to docker instance process.
     */
    public async killDockerInstance(): Promise<void> {
        if (this.docker) {
            await runCmd(`${isPlatform('lin') ? 'kill' : 'taskkill /F /PID'} ${this.docker.pid}`);
            this.docker.running = false;
        }
    }

    /**
     *
     */
    public async restartDockerInstance(): Promise<boolean> {
        if (this.docker && this.docker.name) {
            try {
                if (await this.isDockerInstanceRunning()) {
                    // Docker instance running, call restart command
                    await runCmd(DockerCommand.restart(this.docker.name));
                    logger.info('');
                } else {
                    // Docker instance stopped, call start command
                    await runCmd(DockerCommand.start(this.docker.name));
                    logger.info('');
                }
                this.docker.running = true;
                return true;
            } catch (e) {
                console.log(e);
                logger.error(e);
            }
        }
        logger.info('');
        return false;
    }
}
