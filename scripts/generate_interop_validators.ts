import {initBLS} from "@chainsafe/bls";
import {getInteropKey} from "../src/renderer/services/validator/interop_keys";

const countArg = process.argv[2];
let validatorsCount: number;
if(countArg) {
    validatorsCount = Number(countArg);
} else {
    validatorsCount = 20;
}

(async function(): Promise<void> {
    await initBLS();

    Array.from({length: validatorsCount}).map((_, validatorIndex) => {
        console.log("Validator #"+validatorIndex);
        const privateKey = getInteropKey(validatorIndex);
        console.log("Private key: " + privateKey.toHexString());
        console.log("Public key: " + privateKey.toPublicKey().toHexString() + "\n");
    });
})();
