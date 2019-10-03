import { DockerContainer } from '../../../src/main/Docker/DockerContainer';
import { runCmdAsync } from '../../../src/main/Utils/cmd-utils';
import { DockerCommand } from '../../../src/main/Utils/Docker/DockerCommand';

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
    let dockerContainer: DockerContainer;

    beforeEach(() => {
        dockerContainer = new SimpleDockerContainer();
    });

    // clean up created container
    afterEach(async () => {
        const isRunning = await dockerContainer.isRunning();
        if (isRunning) {
            await dockerContainer.stop();
        }
        await runCmdAsync(`docker rm test-image`).catch();
    }, 20000);

    /**
     * TEST CASE: run-check
     * 1) run docker instance
     * 2) check if instance is running using cmdRun
     */
    it('should execute test case: run-check', async () => {
        if (await DockerContainer.isDockerInstalled()) {
            await dockerContainer.run();
            // wait for docker instance to start
            while (!(await dockerContainer.isRunning())) {}

            const res = await runCmdAsync(DockerCommand.ps('test-image', 'running'));
            expect(res.stdout.split('\n')[1] !== '').toBeTruthy();
        }
    }, 10000);

    /**
     * TEST CASE run-stop-restart
     * 1) run docker instance
     * 2) check if instance is running
     * 3) stop docker instance
     * 4) check if instance is stopped
     * 5) restart docker instance
     * 6) check if instance is running
     */
    it('should execute test case: run-stop-restart', async () => {
        if (await DockerContainer.isDockerInstalled()) {
            // run docker instance
            const docker = await dockerContainer.run();
            while (!(await dockerContainer.isRunning())) {}
            // check if instance is running
            expect(await dockerContainer.isRunning()).toBeTruthy();
            // stop docker instance
            const stopInstance = await dockerContainer.stop();
            // check if instance is stopped
            expect(stopInstance).toBeTruthy();
            expect(await dockerContainer.isRunning()).toBeFalsy();
            // restart docker instance
            const started = await dockerContainer.restart();
            // check if instance is running
            while (!(await dockerContainer.isRunning())) {}
            expect(started).toBeTruthy();
            expect(await dockerContainer.isRunning()).toBeTruthy();
        }
    }, 30000);

    /**
     * TEST CASE: run-kill
     * 1) run docker instance
     * 2) check if instance is running
     * 3) kill docker instance
     * 4) check if instance is stopped
     */
    it('should execute test case: run-kill ', async () => {
        if (await DockerContainer.isDockerInstalled()) {
            // run docker instance
            await dockerContainer.run();
            while (!(await dockerContainer.isRunning())) {}
            // check if instance is running
            expect(await dockerContainer.isRunning()).toBeTruthy();
            // kill docker instance
            await dockerContainer.kill();
            // check if instance is stopped
            expect(await dockerContainer.isRunning()).toBeFalsy();
        }
    }, 10000);
});
