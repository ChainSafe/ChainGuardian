import {ethers, Wallet} from "ethers";
import {deployDepositContract} from "./deposit-test-util";
import {Keypair as KeyPair} from "@chainsafe/bls/lib/keypair";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import {toHexString} from "../../../../src/renderer/services/utils/crypto";
import {DepositTx, generateDeposit} from "../../../../src/renderer/services/deposit";
import {config} from "@chainsafe/eth2.0-config/lib/presets/mainnet";
import {initBLS} from "@chainsafe/bls";

jest.setTimeout(30000);

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const ganache = require("ganache-cli");

describe("Deposit transaction service unit tests", () => {
    let wallet: Wallet;
    let provider: ethers.providers.Web3Provider;
    let depositContractAddress: string;

    beforeAll(async () => {
        await initBLS();
        // create accounts and deploy deposit contract
        const deployWallet = ethers.Wallet.createRandom();
        const accountWallet = PrivateKey.random();
        provider = new ethers.providers.Web3Provider(ganache.provider({
            accounts: [{
                balance: "100000000000000000000",
                secretKey: accountWallet.toHexString(),
            },
            {
                balance: "100000000000000000000",
                secretKey: toHexString(deployWallet.privateKey),
            }],
        }));
        wallet = new ethers.Wallet(accountWallet.toHexString());
        depositContractAddress = await deployDepositContract(provider, toHexString(deployWallet.privateKey));
    });

    it("should send deposit transaction successfully", async () => {
        const keyPair = new KeyPair(PrivateKey.fromHexString(wallet.privateKey));
        const depositData = generateDeposit(keyPair, Buffer.alloc(48, 1,"hex"), "32");
        const depositTx = DepositTx.generateDepositTx(depositData, depositContractAddress, config, "32");
        const signedTx = await depositTx.sign(wallet);
        const transactionResponse = await provider.sendTransaction(toHexString(signedTx));
        expect(transactionResponse).toBeDefined();
        expect(transactionResponse.hash).toBeDefined();
        if (transactionResponse.hash) {
            const receipt = await provider.getTransactionReceipt(transactionResponse.hash);
            expect(receipt).toBeDefined();
            expect(receipt.confirmations).toBeGreaterThan(0);
            expect(receipt.status).toBe(1);
        }
    });
});
