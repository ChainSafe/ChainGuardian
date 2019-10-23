import {generateDeposit, DepositTx} from "../../../../src/renderer/services/deposit/DepositTransactionService";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {Contract, ethers} from "ethers";
import {deployDepositContract, generateKeyPair} from "./utils";
// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const ganache = require("ganache-cli");

describe("Deposit transaction service unit tests", () => {
    const prKey = generateKeyPair(124);
    const prKey2 = generateKeyPair(125);
    const provider = new ethers.providers.Web3Provider(ganache.provider({
        accounts: [{
            balance: "100000000000000000000",
            secretKey: prKey.privateKey.toHexString(),
        },
        {
            balance: "100000000000000000000",
            secretKey: prKey2.privateKey.toHexString(),
        }],
        gasLimit: "0x5F5E100"
    }));

    it.skip("Generate deposit params successfully", async () => {
        const res = generateDeposit(generateKeyPair(124), Buffer.alloc(48, 1,"hex"));
        expect(res).toBeDefined();
    }, 20000);

    it("Generate deposit transaction successfully", async () => {
        const depositContract = await deployDepositContract(provider, prKey.privateKey.toHexString());
        const depositParams = generateDeposit(prKey2, Buffer.alloc(48, 1,"hex"));
        const tx = DepositTx.generateDepositTx(depositParams, depositContract);
        // TODO call contract trough ethersjs Contract class
        // const rs = await depositContract.deposit(
        //     depositParams.publicKey,
        //     depositParams.withdrawalCredentials,
        //     depositParams.signature,
        //     depositParams.root
        // );
        const wallet = new ethers.Wallet(prKey2.privateKey.toHexString(), provider);
        const signedTx = await tx.sign(wallet);
        const rs = await provider.sendTransaction(signedTx);
        expect(rs).toBeDefined();
    }, 40000);
});
