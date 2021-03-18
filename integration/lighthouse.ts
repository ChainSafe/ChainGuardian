import {SecretKey} from "@chainsafe/bls";
import {Keystore} from "@chainsafe/bls-keystore";
import keystore from "./lighthouse-keystore.json";
import assert from "assert";

import {restValidation} from "./restValidation";
const sk = "222222222222222222222222222222222222222222222222222";

(async function (): Promise<void> {
    const {proposer, attestation} = await restValidation({
        baseUrl: "http://localhost:5052",
        getValidatorPrivateKey: async () => SecretKey.fromBytes(await Keystore.fromObject(keystore).decrypt(sk)),
        limit: 2,
    });

    assert.equal(proposer.proposed, proposer.delegated);
    assert.equal(attestation.attestations, attestation.delegated);

    process.exit();
})();
