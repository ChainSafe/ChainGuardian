import {generateDeposit, DepositTx} from "../../../src/renderer/services/deposit/DepositTransactionService";
import {Keypair, Keypair as KeyPair} from "@chainsafe/bls/lib/keypair";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import BN from "bn.js";
// import ganache from "ganache-core";

function generateKeyPair(): KeyPair {
    return new Keypair(PrivateKey.fromBytes(new BN(123).toArrayLike(Buffer, "le", 32)));
}

describe("Deposit transaction service unit tests", () => {

    // const ganacheProvider = ganache.provider();

    // deposit contract address
    const depositContractAddress = "0x9c86825280b1d6c7dB043D4CC86E1549990149f9";

    it("Generate deposit params successfully", () => {
        const res = generateDeposit(generateKeyPair(), Buffer.alloc(48, 1,"hex"));
        expect(res).toBeDefined();
    });

    it("Generate deposit transaction successfully", () => {
        const depositParams = generateDeposit(KeyPair.generate(), Buffer.alloc(48, 1,"hex"));
        const tx = DepositTx.generateDepositTx(depositParams, depositContractAddress);
        expect(tx).toBeDefined();
    });
});
