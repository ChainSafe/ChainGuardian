import { DockerRunParams } from '../../../../src/main/Utils/Docker/DockerRunParams';
import { DockerCommand } from '../../../../src/main/Utils/Docker/DockerCommand';

describe('DockerCommand unit tests', () => {
    // run command
    it('should check if docker run command generating properly', () => {
        const params: DockerRunParams = { name: 'test-image', image: 'test-image' };
        params.cmd = 'test-image-cmd';
        expect(DockerCommand.run(params)).toBe(`docker run --name ${params.name} test-image test-image-cmd`);
    });

    // ps command
    it('should check if docker ps command generating properly', () => {
        expect(DockerCommand.ps().trim()).toBe('docker ps -a');
        expect(DockerCommand.ps('test-container').trim()).toBe(
            'docker ps -a --no-trunc --filter name=^/test-container$'
        );
    });

    // version command
    it('should check if docker version command generating properly', () => {
        expect(DockerCommand.version()).toBe('docker -v');
    });

    // stop command
    it('should check if docker stop command generating properly', () => {
        expect(DockerCommand.stop('test-container')).toBe('docker stop test-container');
    });

    // start command
    it('should check if start command generating properly', () => {
        expect(DockerCommand.start('test-container')).toBe('docker start test-container');
    });

    // restart command
    it('should check if restart command generating properly', () => {
        expect(DockerCommand.restart('test-container')).toBe('docker restart test-container');
    });

    // logs command
    it('should check if logs command generating properly', () => {
        expect(DockerCommand.logs('test-container')).toBe('docker logs test-container');
        expect(DockerCommand.logs('test-container', true)).toBe('docker logs --follow test-container');
    });
});
