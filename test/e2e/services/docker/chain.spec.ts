import {BeaconChain} from "../../../../src/renderer/services/docker/chain";
import {runCmdAsync} from "../../../../src/renderer/services/utils/cmd-utils";
import {assert} from "chai";

// run docker e2e test suit if env variable set
if (process.env["RUN_DOCKER_TESTS"] === "yes")
    describe("docker container e2e tests", tests);
else
    describe.skip("skipping docker container e2e tests", tests);

function tests(): void {
    let beaconChain: BeaconChain;

    // clean up created container
    afterEach(async () => {
        if (await BeaconChain.isDockerInstalled()) {
            const isRunning = await beaconChain.isRunning();
            if (isRunning) {
                await beaconChain.stop();
            }
            await runCmdAsync("docker rm Prysm-beacon-node").catch();
            await runCmdAsync("docker volume rm Prysm-chain-data").catch();
        }
    }, 20000);

    /**
     * TEST CASE: start Prysm chain
     * 1) run docker instance of prysm beacon chain
     * 2) check if instance is running using cmdRun
     */
    it("should execute test case: run-check", async done => {
        if (await BeaconChain.isDockerInstalled()) {
            beaconChain = await BeaconChain.startPrysmBeaconChain();
            // wait for docker instance to start
            while (!(await beaconChain.isRunning())) { /* */}
            done();
        }
    }, 10000);

    /**
     * TEST CASE: start Prysm chain and fetch logs
     * 1) run docker instance of prysm beacon chain
     * 2) check if logs are pipes to instance
     * NOTE: All logs go to stderr
     */
    it("should read logs using listenToLogs", async done => {
        if (await BeaconChain.isDockerInstalled()) {
            beaconChain = await BeaconChain.startPrysmBeaconChain();
            // wait for docker instance to start
            while (!(await beaconChain.isRunning())) { /* */ }
            const logs = beaconChain.getLogs();
            if (!logs) {
                return assert(false, "Logs not found");
            }

            beaconChain.listenToLogs(function(type: string, message: string) {
                assert(type === "info" || type === "error");
                assert(message);
                done();
            });
        }
    }, 10000);
}
