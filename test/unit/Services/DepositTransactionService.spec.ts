import {generateDeposit, generateEth1DepositTx} from "../../../src/renderer/services/DepositTransactionService";
import {Keypair as KeyPair} from "@chainsafe/bls/lib/keypair";

describe("Deposit transaction service unit tests", () => {

    it("Generate deposit params successfully", () => {
        const res = generateDeposit(KeyPair.generate(), Buffer.alloc(48, 1,"hex"));
        expect(res).toBeDefined();
    });

    it("Generate deposit transaction successfully", () => {
        const depositParams = generateDeposit(KeyPair.generate(), Buffer.alloc(48, 1,"hex"));
        const tx = generateEth1DepositTx(depositParams);
        // eslint-disable-next-line no-console
        console.log(tx);
        expect(tx).toBeDefined();
    });
});
