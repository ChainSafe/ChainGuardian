import {getInteropKey} from "../src/renderer/services/validator/interop_keys";
import assert from "assert";
import {restValidation} from "./restValidation";

(async function (): Promise<void> {
    const {proposer, attestation} = await restValidation({
        baseUrl: "http://localhost:5051",
        getValidatorPrivateKey: async () => getInteropKey(7),
        limit: 5,
    });

    assert.equal(proposer.proposed, proposer.delegated);
    assert.equal(attestation.attestations, attestation.delegated);

    process.exit();
})();
