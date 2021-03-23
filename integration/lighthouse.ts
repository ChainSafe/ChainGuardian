import {SecretKey} from "@chainsafe/bls";
import {Keystore} from "@chainsafe/bls-keystore";
import {config} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import assert from "assert";

import {restValidation} from "./restValidation";
import keystore from "./lighthouse-keystore.json";
import {CgLighthouseEth2Api} from "../src/renderer/services/eth2/client/module";
const keystorePassword = "222222222222222222222222222222222222222222222222222";

(async function (): Promise<void> {
    const {proposer, attestation} = await restValidation({
        baseUrl: "http://localhost:5052",
        getValidatorPrivateKey: async () =>
            SecretKey.fromBytes(await Keystore.fromObject(keystore).decrypt(keystorePassword)),
        limit: 2,
        config,
        ApiClient: CgLighthouseEth2Api,
    });

    assert.equal(proposer.proposed, proposer.delegated);
    assert.equal(attestation.attestations, attestation.delegated);

    process.exit();
})();
