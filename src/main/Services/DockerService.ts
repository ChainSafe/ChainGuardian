import { IService } from './interface';
import { DockerRunParams } from '../Utils/Docker/DockerRunParams';
import { DockerCommand } from '../Utils/Docker/DockerCommand';
import { isPlatform, runCmd } from '../Utils/cmd-utils';
import * as logger from 'electron-log';

/**
 * Interface defining started docker instance.
 */
export interface Docker {
    running: boolean;
    name: string;
    pid: number;
}

export class DockerService implements IService {
    private docker: Docker | null;

    constructor() {
        this.docker = null;
    }

    async start(): Promise<any> {
        if (await this.checkIfDockerInstalled()) {
            return;
        }
        throw new Error('Docker not installed!');
    }

    async stop(): Promise<void> {
        if (!(await this.stopDockerInstance())) {
            await this.killDockerInstance();
            this.docker = null;
        }
    }

    /**
     * Checks if docker installed by calling docker -v to check for installed version.
     * If version param is provided, it also checks if installed version is matching.
     *
     * @param version - check if this specific version is installed.
     */
    public async checkIfDockerInstalled(version?: string): Promise<boolean> {
        try {
            const cmdResult = await runCmd(DockerCommand.version());
            const dockerVersion = this.extractDockerVersion(cmdResult.stdout);
            return version ? version === dockerVersion : !!dockerVersion;
        } catch (e) {
            logger.error(e);
            return false;
        }
    }

    /**
     * Runs docker instance defined by provided argument.
     * If docker instance already started this method will just return false.
     *
     * @param params - instance of @{DockerRunParams}
     * @return Promise<boolean> - true if instance successfully started, false otherwise
     */
    public async runDockerInstance(params: DockerRunParams): Promise<boolean> {
        if (!this.docker) {
            // start new docker instance
            try {
                const cmdResult = await runCmd(DockerCommand.run(params));
                // check if error occurred
                if (cmdResult.stderr) {
                    logger.error(
                        `Error on starting ${params.name} docker instance from image ${params.image}`,
                        cmdResult.stderr
                    );
                    return false;
                }
                this.docker = { running: true, name: params.name, pid: cmdResult.pid };
                logger.info(`Docker instance ${this.docker.name} started.`);
                return true;
            } catch (e) {
                logger.error(e);
                return false;
            }
        }
        // Docker instance already running
        logger.error(`Docker instance ${this.docker.name} already running`);
        return false;
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
        console.log(this.docker);
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

    private extractDockerVersion(dockerLog: string): string | null {
        let regexec: RegExpExecArray | null;
        regexec = /Docker version (\d+\.\d+\.\d+)/.exec(dockerLog);
        return regexec ? regexec[1] : null;
    }
}
