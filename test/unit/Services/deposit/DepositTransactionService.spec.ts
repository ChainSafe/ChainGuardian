import {generateDeposit, DepositTx} from "../../../../src/renderer/services/deposit/DepositTransactionService";
import {ethers} from "ethers";
import {deployDepositContract, generateKeyPair} from "./deposit-test-util";
import eth1WalletProvider from "ethereumjs-wallet";
import {Keypair} from "@chainsafe/bls/lib/keypair";
// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const ganache = require("ganache-cli");

describe("Deposit transaction service unit tests", () => {
    let account: Keypair;
    let deployAccount: Keypair;
    let provider: ethers.providers.Web3Provider;
    let depositContract: string;

    beforeAll(async () => {
        deployAccount = generateKeyPair(125);
        account = generateKeyPair(124);
        provider = new ethers.providers.Web3Provider(ganache.provider({
            accounts: [{
                balance: "100000000000000000000",
                secretKey: account.privateKey.toHexString(),
            },
            {
                balance: "100000000000000000000",
                secretKey: deployAccount.privateKey.toHexString(),
            }],
        }));
        depositContract = await deployDepositContract(provider, deployAccount.privateKey.toHexString());
    });

    it.skip("Generate deposit params successfully", async () => {
        const res = generateDeposit(generateKeyPair(124), Buffer.alloc(48, 1,"hex"));
        expect(res).toBeDefined();
    }, 20000);

    it("Generate deposit transaction successfully", async () => {
        const depositParams = generateDeposit(account, Buffer.alloc(48, 1,"hex"));
        const tx = DepositTx.generateDepositTx(depositParams, depositContract);
        const wallet = eth1WalletProvider.fromPrivateKey(account.privateKey.toBytes());
        // const wallet = new ethers.Wallet(prKey2.privateKey.toHexString(), provider);
        const signedTx = await tx.sign(wallet);
        const rs = await provider.sendTransaction(`0x${signedTx}`);
        if (rs.hash) {
            const t = await provider.getTransactionReceipt(rs.hash);
            expect(t).toBeDefined();
        }
        expect(rs).toBeDefined();
    }, 40000);
});
