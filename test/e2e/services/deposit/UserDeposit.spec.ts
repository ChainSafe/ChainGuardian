import {ethers, Wallet} from "ethers";
import {deployDepositContract} from "./deposit-test-util";
import {Keypair as KeyPair, Keypair} from "@chainsafe/bls/lib/keypair";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import {toHexString} from "../../../../src/renderer/services/utils/crypto-utils";
import {DepositTx, generateDeposit} from "../../../../src/renderer/services/deposit";
import {config} from "@chainsafe/eth2.0-config/lib/presets/mainnet";
import {EthersNotifier} from "../../../../src/renderer/services/deposit/ethers";
import BN from "bn.js";

jest.setTimeout(30000);

const EVENT_TIMEOUT = 30000;

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const ganache = require("ganache-cli");


describe("Deposit transaction service unit tests", () => {
    let wallet: Wallet;
    let invalidWallet: Wallet;
    let provider: ethers.providers.Web3Provider;
    let depositContractAddress: string;

    beforeAll(async () => {
        // create accounts and deploy deposit contract
        const deployWallet = ethers.Wallet.createRandom();
        const accountWallet = ethers.Wallet.createRandom();
        const invalidDepositWallet = ethers.Wallet.createRandom();
        provider = new ethers.providers.Web3Provider(ganache.provider({
            accounts: [{
                balance: "100000000000000000000",
                secretKey: toHexString(accountWallet.privateKey),
            },
            {
                balance: "100000000000000000000",
                secretKey: toHexString(invalidDepositWallet.privateKey),
            },
            {
                balance: "100000000000000000000",
                secretKey: toHexString(deployWallet.privateKey),
            }],
        }));
        wallet = accountWallet;
        invalidWallet = invalidDepositWallet;
        depositContractAddress = await deployDepositContract(provider, toHexString(deployWallet.privateKey));
    });

    it("should check if user deposited valid amount", async () => {
        const keyPair = new KeyPair(PrivateKey.fromHexString(wallet.privateKey));
        const ethersNotifier = new EthersNotifier(provider, depositContractAddress, config, keyPair);
        const amounts = ["8", "25"]; // sum is greater than 32
        await generateMultilpleTransactions(keyPair, depositContractAddress, wallet, provider, amounts);
        const isValidDepositAmount = await ethersNotifier.checkUserDepositAmount();
        expect(isValidDepositAmount).toBe(true);
    });


    it("should fail because user deposit sum is invalid", async () => {
        const keyPair = new KeyPair(PrivateKey.fromHexString(invalidWallet.privateKey));
        const ethersNotifier = new EthersNotifier(provider, depositContractAddress, config, keyPair);
        const amounts = ["1", "12"]; // sum is less than 32
        await generateMultilpleTransactions(keyPair, depositContractAddress, invalidWallet, provider, amounts);
        const isValidDepositAmount = await ethersNotifier.checkUserDepositAmount();
        expect(isValidDepositAmount).toBe(false);
    });

    it("should emit event when someone deposit ether to contract", async (done) => {
        const keyPair = new KeyPair(PrivateKey.fromHexString(wallet.privateKey));
        const ethersNotifier = new EthersNotifier(provider, depositContractAddress, config, keyPair);

        ethersNotifier.depositEventListener(EVENT_TIMEOUT)
            .then((amountGwei: BN) => {
                const expectedAmount = new BN(ethers.utils.parseUnits("15", "gwei").toString());
                expect(amountGwei.cmp(expectedAmount)).toEqual(0);
                done();
            });

        const amounts = ["15"];
        await generateMultilpleTransactions(keyPair, depositContractAddress, wallet, provider, amounts);
    });
});

async function generateMultilpleTransactions(
    keyPair: Keypair,
    depositContractAddress: string,
    wallet: Wallet,
    provider: ethers.providers.Web3Provider,
    amounts: string[]): Promise<void> {

    await asyncForEach(amounts, async (amount: string) => {
        const depositData = generateDeposit(keyPair, Buffer.alloc(48, 1, "hex"), amount);
        const depositTx = DepositTx.generateDepositTx(depositData, depositContractAddress, config, amount);
        const nonce = await provider.getTransactionCount(wallet.address);
        const signedTx = await depositTx.sign(wallet, nonce);
        await provider.sendTransaction(toHexString(signedTx));
    });
}

async function asyncForEach(array: string[], callback: any): Promise<void> {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}


