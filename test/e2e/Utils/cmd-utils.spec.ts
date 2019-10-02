import { runCmd, CmdRun, isPlatform, streamToString } from '../../../src/main/Utils/cmd-utils';
import { Readable } from 'stream';

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

    it('should successfully call command with streams returned', async () => {
        const exec: CmdRun = await runCmd(isPlatform('win') ? 'dir' : 'ls', true);
        if (exec.stdout instanceof Readable && exec.stderr instanceof Readable) {
            const stdoutPromise = streamToString(exec.stdout);
            const stderrPromise = streamToString(exec.stderr);
            const [stdout, stderr] = await Promise.all([stdoutPromise, stderrPromise]);
            expect(stdout !== '').toBeTruthy();
            expect(stderr === '').toBeTruthy();
        } else {
            fail('Streams not provided.');
        }
    });
});
