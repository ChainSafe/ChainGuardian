import { runCmd, CmdRun, isPlatform } from '../../../src/main/Utils/cmd-utils';

describe('Cmd utils unit tests', () => {
    it('should successfully call command in console', async () => {
        const exec: CmdRun = await runCmd(isPlatform('win') ? 'dir' : 'ls');
        expect(exec.stdout).toBeDefined();
        expect(exec.pid).toBeDefined();
    }, 10000);

    it('should fail to call command in console', async () => {
        try {
            await runCmd('no-command');
        } catch (errExec) {
            expect(errExec.stderr).toBeDefined();
            expect(errExec.pid).toBeDefined();
        }
    }, 10000);
});
