import {PrivateKey} from "@chainsafe/bls";
import {toBufferBE} from "bigint-buffer";
import {bytesToBigInt, intToBytes} from "@chainsafe/lodestar-utils";
import {hash} from "@chainsafe/ssz";

const CURVE_ORDER = BigInt("52435875175126190479447740508185965837690552500527637822603658699938581184513");

export function getInteropKey(index: number): PrivateKey {
    return PrivateKey.fromBytes(toBufferBE(bytesToBigInt(hash(intToBytes(index, 32))) % CURVE_ORDER, 32));
}
