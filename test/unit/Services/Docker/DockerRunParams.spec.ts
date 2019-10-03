import { DockerRunParams, generateRunCommand } from '../../../../src/renderer/services/docker/DockerRunParams';

describe('DockerRunParams unit tests', () => {
    it('should generate simple valid params for run command', () => {
        const params: DockerRunParams = { image: 'test-image', name: 'test-image-name' };
        expect(generateRunCommand(params).trim()).toBe(`--name ${params.name} test-image`);
    });

    it('should generate full valid params for run command', () => {
        const params: DockerRunParams = {
            name: 'test-image-name',
            detached: true,
            privileged: true,
            ipc: 'none',
            restart: 'always',
            publishAllPorts: true,
            image: 'test-image',
            cmd: 'ls'
        };
        expect(generateRunCommand(params).trim()).toBe(
            `--name ${params.name} -d --privileged=true --ipc="none" --restart=always -P test-image ls`
        );
    });
});
