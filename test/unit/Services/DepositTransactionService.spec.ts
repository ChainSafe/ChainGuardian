import {generateDeposit, generateEth1DepositTx} from "../../../src/renderer/services/deposit/DepositTransactionService";
import {Keypair, Keypair as KeyPair} from "@chainsafe/bls/lib/keypair";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import BN from "bn.js";

function generateKeyPair(): KeyPair {
    return new Keypair(PrivateKey.fromBytes(new BN(123).toArrayLike(Buffer, "le", 32)));
}

describe("Deposit transaction service unit tests", () => {

    it("Generate deposit params successfully", () => {
        const res = generateDeposit(generateKeyPair(), Buffer.alloc(48, 1,"hex"));
        expect(res).toBeDefined();
    });

    it("Generate deposit transaction successfully", () => {
        const depositParams = generateDeposit(KeyPair.generate(), Buffer.alloc(48, 1,"hex"));
        const tx = generateEth1DepositTx(depositParams);
        expect(tx).toBeDefined();
    });
});
