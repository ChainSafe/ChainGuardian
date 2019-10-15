import {generateDeposit} from "../../../src/renderer/services/DepositTransactionService";
import {Keypair as KeyPair} from "@chainsafe/bls/lib/keypair";

describe("Deposit transaction service unit tests", () => {

    it("Generate deposit params successfully", () => {
        const res = generateDeposit(KeyPair.generate(), Buffer.alloc(48, 1,"hex"));
        expect(res).toBeDefined();
    });
});
