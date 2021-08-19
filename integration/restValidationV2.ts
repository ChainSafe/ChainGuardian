import {init as initBLS, SecretKey} from "@chainsafe/bls";
import {Keystore} from "@chainsafe/bls-keystore";

import keystore from "./lighthouse-keystore.json";
import {CgLighthouseEth2Api} from "../src/renderer/services/eth2/client/module";
import {config} from "../src/renderer/services/eth2/config/pyromont";
import {Validator} from "@chainsafe/lodestar-validator";
import sinon from "sinon";
import {CGSlashingProtection} from "../src/renderer/services/eth2/client/slashingProtection";
import {LogLevel, WinstonLogger} from "@chainsafe/lodestar-utils";
import {getInteropKey} from "../src/renderer/services/validator/interop_keys";

(async function (): Promise<void> {
    process.env.NODE_ENV = "validator-test";
    await initBLS("blst-native");

    const baseUrl = "http://localhost:5051";
    const PK = getInteropKey(7);

    console.log(config);
    const api = new CgLighthouseEth2Api(config, baseUrl);

    const logger = new WinstonLogger({module: "ChainGuardian", level: LogLevel.silly});
    const slashingProtection = sinon.createStubInstance(CGSlashingProtection);

    const validatorService = await Validator.initializeFromBeaconNode({
        slashingProtection,
        api,
        config,
        secretKeys: [PK],
        logger,
        graffiti: "ChainGuardian",
    });

    console.warn("validator initiliazed");
    validatorService.start();

    console.log("\n\n\n");
})();
