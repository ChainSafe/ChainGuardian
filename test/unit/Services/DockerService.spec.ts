import { DockerService } from '../../../src/main/Services/DockerService';

describe('Docker service unit tests', () => {
    let dockerService: DockerService;

    beforeEach(async () => {
        dockerService = new DockerService();
        await dockerService.start();
    });

    // clean up created container
    afterEach(async () => {
        await dockerService.stop();
    }, 20000);

    it('should check if docker installed and return true', async () => {
        expect(await dockerService.checkIfDockerInstalled()).toBeTruthy();
    });

    it('should check if docker version is installed and return false', async () => {
        expect(await dockerService.checkIfDockerInstalled('11.02.2')).toBeFalsy();
    });

    // leave commented because it should be tweaked by each computer running tests
    // it('check if specific docker version is installed should return true', async () => {
    //     expect(await dockerService.checkIfDockerInstalled("19.03.2")).toBeTruthy();
    // });
});
