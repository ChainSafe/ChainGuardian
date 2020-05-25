import {ethers, Wallet} from "ethers";
import {deployDepositContract} from "./deposit-test-util";
import DepositContract from "../../../../src/renderer/services/deposit/options";
import {Keypair as KeyPair, Keypair} from "@chainsafe/bls/lib/keypair";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import {toHexString} from "../../../../src/renderer/services/utils/crypto";
import {DepositTx, generateDeposit} from "../../../../src/renderer/services/deposit";
import {config} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import {DEPOSIT_EVENT_TIMEOUT_MESSAGE, EthersNotifier} from "../../../../src/renderer/services/deposit/ethers";
import {INetworkConfig} from "../../../../src/renderer/services/interfaces";
import {initBLS} from "@chainsafe/bls";

jest.setTimeout(30000);

const EVENT_TIMEOUT = 30000;

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const ganache = require("ganache-cli");


describe("Deposit transaction service unit tests", () => {
    let wallet: Wallet;
    let invalidWallet: Wallet;
    let provider: ethers.providers.Web3Provider;
    let depositContractAddress: string;
    let networkConfig: INetworkConfig;

    beforeAll(async () => {
        await initBLS();
        // create accounts and deploy deposit contract
        const deployWallet = ethers.Wallet.createRandom();
        const accountWallet = PrivateKey.random();
        const invalidDepositWallet = PrivateKey.random();
        provider = new ethers.providers.Web3Provider(ganache.provider({
            accounts: [{
                balance: "100000000000000000000",
                secretKey: accountWallet.toHexString(),
            },
            {
                balance: "100000000000000000000",
                secretKey: invalidDepositWallet.toHexString(),
            },
            {
                balance: "100000000000000000000",
                secretKey: toHexString(deployWallet.privateKey),
            }],
        }));
        wallet = new ethers.Wallet(accountWallet.toHexString());
        invalidWallet = new ethers.Wallet(invalidDepositWallet.toHexString());
        depositContractAddress = await deployDepositContract(provider, toHexString(deployWallet.privateKey));
        networkConfig = {
            eth2Config: config,
            networkName: "test",
            eth1Provider: provider,
            networkId: 1,
            contract: {
                address: depositContractAddress,
                bytecode: DepositContract.bytecode,
                depositAmount: 32,
                deployedAtBlock: await provider.getBlockNumber()
            },
            dockerConfig: {
                name: "UserDepositTest",
                image: "not-important",
                volumeName: "not-important",
            }
        };
    });

    it("should check if user deposited valid amount", async () => {
        const keyPair = new KeyPair(PrivateKey.fromHexString(wallet.privateKey));
        const ethersNotifier = new EthersNotifier(networkConfig, provider);
        const amounts = ["8", "25"]; // sum is greater than 32
        await generateMultilpleTransactions(keyPair, depositContractAddress, wallet, provider, amounts);
        const isValidDepositAmount = await ethersNotifier.hasUserDeposited(keyPair.publicKey);
        expect(isValidDepositAmount).toBe(true);
    });


    it("should fail because user deposit sum is invalid", async () => {
        const keyPair = new KeyPair(PrivateKey.fromHexString(invalidWallet.privateKey));
        const ethersNotifier = new EthersNotifier(networkConfig, provider);
        const amounts = ["1", "12"]; // sum is less than 32
        await generateMultilpleTransactions(keyPair, depositContractAddress, invalidWallet, provider, amounts);
        const isValidDepositAmount = await ethersNotifier.hasUserDeposited(keyPair.publicKey);
        expect(isValidDepositAmount).toBe(false);
    });

    it("should emit event when someone deposit ether to contract", async (done) => {
        const keyPair = new KeyPair(PrivateKey.fromHexString(wallet.privateKey));
        const ethersNotifier = new EthersNotifier(networkConfig, provider);

        ethersNotifier.depositEventListener(keyPair.publicKey, EVENT_TIMEOUT)
            .then((amountGwei: bigint) => {
                const expectedAmount = BigInt(ethers.utils.parseUnits("15", "gwei").toString());
                expect(amountGwei === expectedAmount);
                done();
            });

        const amounts = ["15"];
        await generateMultilpleTransactions(keyPair, depositContractAddress, wallet, provider, amounts);
    });

    it("should throw error because event was not emited", async (done) => {
        const keyPair = new KeyPair(PrivateKey.fromHexString(wallet.privateKey));
        const ethersNotifier = new EthersNotifier(networkConfig, provider);

        // Reduce timeout for test time
        ethersNotifier.depositEventListener(keyPair.publicKey, 3000)
            .catch(err => {
                expect(err).toEqual(new Error(DEPOSIT_EVENT_TIMEOUT_MESSAGE));
                done();
            });
    });
});

async function generateMultilpleTransactions(
    keyPair: Keypair,
    depositContractAddress: string,
    wallet: Wallet,
    provider: ethers.providers.Web3Provider,
    amounts: string[]): Promise<void> {

    await asyncForEach(amounts, async (amount: string) => {
        const depositData = generateDeposit(keyPair, Buffer.alloc(48, 1, "hex"), amount, config);
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


