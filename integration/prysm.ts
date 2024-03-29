import {getInteropKey} from "../src/renderer/services/validator/interop_keys";
import assert from "assert";
import {restValidation} from "./restValidation";
import {CgPrysmEth2Api} from "../src/renderer/services/eth2/client/module";

(async function (): Promise<void> {
    const {proposer, attestation} = await restValidation({
        baseUrl: "http://localhost:5051",
        getValidatorPrivateKey: async () => getInteropKey(15),
        limit: 2,
        ApiClient: CgPrysmEth2Api,
    });

    console.log("\n\n\n");
    let isFailed = false;
    try {
        assert.equal(proposer.proposed, proposer.delegated);
        console.info(`Successfully proposed all ${proposer.delegated} blocks`);
    } catch (e) {
        console.error("Proposals", e.message);
        isFailed = true;
    }
    try {
        assert.equal(attestation.attestations, attestation.delegated);
        console.info(`Successfully provide all ${proposer.delegated} attestations`);
    } catch (e) {
        console.error("Attestations", e.message);
        isFailed = true;
    }
    process.exit(Number(isFailed));
})();
