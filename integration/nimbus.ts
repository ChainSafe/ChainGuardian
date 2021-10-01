import assert from "assert";
import {restValidation} from "./restValidation";
import {CgNimbusEth2Api} from "../src/renderer/services/eth2/client/module";
import {SecretKey} from "@chainsafe/bls";
import {Keystore} from "@chainsafe/bls-keystore";

import keystore from "./nimbus-keystore.json";
const keystorePassword = "4E015C5AF6C9610B0230DBC4FD9714B786F24A28414E49C52D85950E1ED23AD8";

(async function (): Promise<void> {
    const {proposer, attestation} = await restValidation({
        baseUrl: "http://localhost:5052",
        getValidatorPrivateKey: async () =>
            SecretKey.fromBytes(await Keystore.fromObject(keystore).decrypt(keystorePassword)),
        limit: 5,
        ApiClient: CgNimbusEth2Api,
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
