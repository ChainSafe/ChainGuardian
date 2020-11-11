import {
    runCmd,
    ICmdRun,
    isPlatform,
    streamToString,
    runCmdAsync,
    ICmdRunAsync,
} from "../../../src/renderer/services/utils/cmd";

describe("Cmd utils unit tests", () => {
    it("should successfully async call command in console", async () => {
        const exec: ICmdRunAsync = await runCmdAsync(isPlatform("win") ? "dir" : "ls");
        expect(exec.stdout).toBeDefined();
        expect(exec.stdout.length).toBeGreaterThan(1);
        expect(exec.stderr).toBeDefined();
        expect(exec.stderr.length).toBe(0);
    }, 10000);

    it("should fail to call command in console", async () => {
        try {
            await runCmdAsync("no-command");
        } catch (errExec) {
            expect(errExec.stderr).toBeDefined();
            expect(errExec.stderr.length).toBeGreaterThan(1);
            expect(errExec.stdout).toBeDefined();
            expect(errExec.stdout.length).toBe(0);
        }
    }, 10000);

    it("should successfully call command with streams returned", async () => {
        const exec: ICmdRun = runCmd(isPlatform("win") ? "dir" : "ls");
        const [stdout, stderr] = await Promise.all([streamToString(exec.stdout), streamToString(exec.stderr)]);
        expect(stdout).toBeDefined();
        expect(stdout.length).toBeGreaterThan(1);
        expect(stderr).toBeDefined();
        expect(stderr.length).toBe(0);
    }, 10000);
});
