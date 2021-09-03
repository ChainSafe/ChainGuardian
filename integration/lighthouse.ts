import {SecretKey} from "@chainsafe/bls";
import {Keystore} from "@chainsafe/bls-keystore";
import assert from "assert";

import {restValidation} from "./restValidation";
import keystore from "./lighthouse-keystore.json";
import {CgLighthouseEth2Api} from "../src/renderer/services/eth2/client/module";
const keystorePassword = "222222222222222222222222222222222222222222222222222";

(async function (): Promise<void> {
    const {proposer, attestation} = await restValidation({
        baseUrl: "http://localhost:4051",
        getValidatorPrivateKey: async () =>
            SecretKey.fromBytes(await Keystore.fromObject(keystore).decrypt(keystorePassword)),
        limit: 2,
        ApiClient: CgLighthouseEth2Api,
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
