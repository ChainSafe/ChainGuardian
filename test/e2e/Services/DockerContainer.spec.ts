import { DockerContainer } from '../../../src/main/Docker/DockerContainer';
import { runCmd } from '../../../src/main/Utils/cmd-utils';
import { DockerCommand } from '../../../src/main/Utils/Docker/DockerCommand';
import { Readable } from 'stream';

class SimpleDockerContainer extends DockerContainer {
    constructor() {
        super({
            image: 'alpine',
            name: 'test-image',
            detached: true,
            cmd: 'tail -f /dev/null'
        });
    }
}

describe('Docker container e2e tests', () => {
    let dockerService: DockerContainer;

    beforeEach(async () => {
        dockerService = new SimpleDockerContainer();
    });

    // clean up created container
    afterEach(async () => {
        await dockerService.stopDockerInstance();
        await runCmd(`docker rm test-image`);
    }, 20000);

    it('should run docker instance', async () => {
        if (await DockerContainer.isDockerInstalled()) {
            const docker = await dockerService.run();
            expect(docker.running).toBeTruthy();
            const res = await runCmd(DockerCommand.ps('test-image', 'running'));
            if (!(res.stdout instanceof Readable)) {
                expect(res.stdout.split('\n')[1] !== '').toBeTruthy();
            }
            const stopInstance = await dockerService.stopDockerInstance();
            expect(stopInstance).toBeTruthy();
            expect(await dockerService.isDockerInstanceRunning()).toBeFalsy();
        }
    }, 20000);

    it('should restart docker instance using service', async () => {
        if (await DockerContainer.isDockerInstalled()) {
            // start docker instance
            const docker = await dockerService.run();
            expect(docker.running).toBeTruthy();
            expect(await dockerService.isDockerInstanceRunning()).toBeTruthy();
            // stop docker instance
            const stopped = await dockerService.stopDockerInstance();
            expect(stopped).toBeTruthy();
            expect(await dockerService.isDockerInstanceRunning()).toBeFalsy();
            // restart docker instance
            const started = await dockerService.restartDockerInstance();
            expect(started).toBeTruthy();
            expect(await dockerService.isDockerInstanceRunning()).toBeTruthy();
        }
    }, 20000);

    it('should see that docker instance is not running', async () => {
        if (await DockerContainer.isDockerInstalled()) {
            // start docker instance
            const docker = await dockerService.run();
            expect(docker.running).toBeTruthy();
            expect(await dockerService.isDockerInstanceRunning()).toBeTruthy();
            // stop docker instance not using service
            await runCmd(DockerCommand.stop('test-image'));
            // test isDockerInstanceRunning method
            expect(await dockerService.isDockerInstanceRunning()).toBeFalsy();
        }
    }, 20000);
});
