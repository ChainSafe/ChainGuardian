import { DockerService } from '../../../src/main/Services/DockerService';
import { DockerRunParams } from '../../../src/main/Utils/Docker/DockerRunParams';
import { runCmd } from '../../../src/main/Utils/cmd-utils';
import { DockerCommand } from '../../../src/main/Utils/Docker/DockerCommand';

describe('Docker service e2e tests', () => {
    let dockerService: DockerService;
    const dockerImageParams: DockerRunParams = {
        image: 'alpine',
        name: 'test-image',
        detached: true,
        cmd: 'tail -f /dev/null'
    };

    beforeEach(async () => {
        dockerService = new DockerService();
        await dockerService.start();
    });

    // clean up created container
    afterEach(async () => {
        await dockerService.stop();
        await runCmd(`docker rm ${dockerImageParams.name}`);
    }, 20000);

    it('should run docker instance', async () => {
        const running = await dockerService.runDockerInstance(dockerImageParams);
        expect(running).toBeTruthy();
        const res = await runCmd(DockerCommand.ps(dockerImageParams.name, 'running'));
        expect(res.stdout.split('\n')[1] !== '').toBeTruthy();
    }, 20000);

    it('should restart docker instance using service', async () => {
        // start docker instance
        const running = await dockerService.runDockerInstance(dockerImageParams);
        expect(running).toBeTruthy();
        expect(await dockerService.isDockerInstanceRunning()).toBeTruthy();
        // stop docker instance
        const stopped = await dockerService.stopDockerInstance();
        expect(stopped).toBeTruthy();
        expect(await dockerService.isDockerInstanceRunning()).toBeFalsy();
        // restart docker instance
        const started = await dockerService.restartDockerInstance();
        expect(started).toBeTruthy();
        expect(await dockerService.isDockerInstanceRunning()).toBeTruthy();
    }, 20000);

    it('should see that docker instance is not running', async () => {
        // start docker instance
        const running = await dockerService.runDockerInstance(dockerImageParams);
        expect(running).toBeTruthy();
        expect(await dockerService.isDockerInstanceRunning()).toBeTruthy();
        // stop docker instance not using service
        await runCmd(DockerCommand.stop(dockerImageParams.name));
        // test isDockerInstanceRunning method
        expect(await dockerService.isDockerInstanceRunning()).toBeFalsy();
    }, 20000);
});
