import {init as initBLS, SecretKey} from "@chainsafe/bls";
import {Keystore} from "@chainsafe/bls-keystore";

import keystore from "./lighthouse-keystore.json";
import {CgLighthouseEth2Api} from "../src/renderer/services/eth2/client/module";
import {config} from "../src/renderer/services/eth2/config/pyromont";

const keystorePassword = "222222222222222222222222222222222222222222222222222";
(async function (): Promise<void> {
    process.env.NODE_ENV = "validator-test";
    await initBLS("blst-native");

    const baseUrl = "http://localhost:5052";
    const PK = SecretKey.fromBytes(await Keystore.fromObject(keystore).decrypt(keystorePassword));

    console.log(config);
    const api = new CgLighthouseEth2Api(config, baseUrl);

    console.log(PK);

    const r = await api.beacon.getGenesis();
    console.warn(r);

    console.log("\n\n\n");
})();
