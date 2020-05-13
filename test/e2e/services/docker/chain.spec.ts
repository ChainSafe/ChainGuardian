import {BeaconChain} from "../../../../src/renderer/services/docker/chain";
import {DockerRegistry} from "../../../../src/renderer/services/docker/docker-registry";
import {SupportedNetworks} from "../../../../src/renderer/services/eth2/supportedNetworks";
import {runCmdAsync} from "../../../../src/renderer/services/utils/cmd";
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
            const name = BeaconChain.getContainerName(SupportedNetworks.SCHLESI);
            DockerRegistry.removeContainer(name);
            await runCmdAsync(`docker rm ${name}`);
            await runCmdAsync(`docker volume rm ${SupportedNetworks.SCHLESI}-chain-data`);
        }
    }, 20000);

    /**
     * TEST CASE: start Schlesi chain
     * 1) run docker instance of schlesi beacon chain
     * 2) check if instance is running using cmdRun
     */
    it("should execute test case: run-check", async done => {
        if (await BeaconChain.isDockerInstalled()) {
            beaconChain = await BeaconChain.startBeaconChain(SupportedNetworks.SCHLESI);
            // wait for docker instance to start
            while (!(await beaconChain.isRunning())) { /* */}
            done();
        }
    }, 10000);

    /**
     * TEST CASE: start Schlesi chain and fetch logs
     * 1) run docker instance of schlesi beacon chain
     * 2) check if logs are pipes to instance
     * NOTE: All logs go to stderr
     */
    it("should read logs using listenToLogs", async done => {
        if (await BeaconChain.isDockerInstalled()) {
            beaconChain = await BeaconChain.startBeaconChain(SupportedNetworks.SCHLESI);
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
