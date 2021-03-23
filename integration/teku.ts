import {getInteropKey} from "../src/renderer/services/validator/interop_keys";
import assert from "assert";
import {restValidation} from "./restValidation";
import {config} from "@chainsafe/lodestar-config/lib/presets/minimal";
import {CgTekuEth2Api} from "../src/renderer/services/eth2/client/module";

(async function (): Promise<void> {
    const {proposer, attestation} = await restValidation({
        baseUrl: "http://localhost:5051",
        getValidatorPrivateKey: async () => getInteropKey(7),
        limit: 5,
        config,
        ApiClient: CgTekuEth2Api,
    });

    assert.equal(proposer.proposed, proposer.delegated);
    assert.equal(attestation.attestations, attestation.delegated);

    process.exit();
})();
