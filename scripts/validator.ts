import {initBLS, Keypair} from "@chainsafe/bls";
import {Validator} from "@chainsafe/lodestar-validator";
import {ValidatorDB} from "../src/renderer/services/db/api/validator";
import {CGDatabase} from "../src/renderer/services/db/api";
import {LevelDbController} from "../src/main/db/controller";
import rimraf from "rimraf";
import {LighthouseEth2ApiClient} from "../src/renderer/services/eth2/client/lighthouse/lighthouse";
import {config} from "@chainsafe/lodestar-config/lib/presets/minimal";
import {LogLevel, WinstonLogger} from "@chainsafe/lodestar-utils";
import {getInteropKey} from "../src/renderer/services/validator/interop_keys";

const validatorIndexArg = process.argv[2];

if(!validatorIndexArg && validatorIndexArg !== "0") {
    throw "Missing validator index argument (positional)";
}

(async function() {
    await initBLS();
    const validatorPrivateKey = getInteropKey(Number(validatorIndexArg));
    console.log("Starting validator " + validatorPrivateKey.toPublicKey().toHexString());
    rimraf.sync("./.tmp/validator-script-db");
    const logger = new WinstonLogger({module: "ChainGuardian", level: "verbose"});
    const db = new CGDatabase({
        controller: new LevelDbController({location: "./.tmp/validator-script-db"})
    });
    await db.start();
    const validatorService = new Validator({
        db: new ValidatorDB(db),
        api: new LighthouseEth2ApiClient({baseUrl: "http://localhost:5052", logger, config}),
        config,
        keypair: new Keypair(validatorPrivateKey),
        logger
    });
    await validatorService.start();
})();
