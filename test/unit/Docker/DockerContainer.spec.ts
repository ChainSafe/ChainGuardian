import { DockerContainer } from '../../../src/main/Docker/DockerContainer';
import * as cmdUtils from '../../../src/main/Utils/cmd-utils';
import * as sinon from 'sinon';

describe('Docker container unit tests', () => {
    const runCmdStub = sinon.stub(cmdUtils, 'runCmd');

    it('should check if docker installed when docker is installed', async () => {
        runCmdStub.resolves({
            pid: 1,
            stdout: 'Docker version 12.02.2, build 21a1',
            stderr: ''
        });
        expect(await DockerContainer.isDockerInstalled()).toBeTruthy();
        expect(await DockerContainer.isDockerInstalled('12.02.2')).toBeTruthy();
        expect(await DockerContainer.isDockerInstalled('13.02.2')).toBeFalsy();
    });

    it('should check if docker installed when docker is not installed', async () => {
        runCmdStub.resolves({
            pid: 1,
            stdout: 'Docker is not recognized as an internal or external command, operable program or batch file.',
            stderr: ''
        });
        expect(await DockerContainer.isDockerInstalled('11.02.2')).toBeFalsy();
    });
});
