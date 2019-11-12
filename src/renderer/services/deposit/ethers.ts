import {ethers, utils, Contract} from "ethers";
import {DEPOSIT_AMOUNT} from "./constants";
import {bool, Gwei} from "@chainsafe/eth2.0-types";
import DepositContract from "./options";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import {deserialize} from "@chainsafe/ssz";
import BN from "bn.js";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";

const PUBKEY_INDEX = 0;
const DATA_INDEX = 2;
const DEPOSIT_AMOUNT_GWEI = new BN(DEPOSIT_AMOUNT).imul(new BN(ethers.utils.parseUnits("1", "gwei").toString()));
const DEPOSIT_EVENT = "DepositEvent";

export class EthersNotifier {
    private provider: ethers.providers.Web3Provider;
    private depositContractAddress: string;
    private config: IBeaconConfig;
    private signingKey: Keypair;

    public constructor(
        provider: ethers.providers.Web3Provider,
        depositContractAddress: string,
        config: IBeaconConfig,
        signingKey: Keypair) {
        this.provider = provider;
        this.depositContractAddress = depositContractAddress;
        this.config = config;
        this.signingKey = signingKey;
    }

    public depositEventListener(timeout: number): Promise<BN>{
        return new Promise((resolve, reject) => {
            const contract = new Contract(this.depositContractAddress, DepositContract.abi, this.provider);
            const filter = contract.filters.DepositEvent(null);
    
            // Listen for our filtered results
            contract.on(filter, (pubkey, withdrawalCredentials, amount) => {
                if (pubkey === this.signingKey.publicKey.toHexString()) {
                    const amountGwei = deserialize(Buffer.from(amount.slice(2), "hex"), this.config.types.Gwei) as Gwei;
                    console.log("Received " + amountGwei.toString() + " gwei from " + pubkey);
                    clearTimeout(timer);
                    contract.removeAllListeners(DEPOSIT_EVENT);
                    resolve(amountGwei);
                }
            });

            const timer = setTimeout(() => {
                contract.removeAllListeners(DEPOSIT_EVENT);
                reject(new Error("Timeout waiting for deposit event"));
            }, timeout);
        });
    }

    public async checkUserDepositAmount(): Promise<bool> {
        const filter = {
            fromBlock: 0,
            address: this.depositContractAddress
        };
    
        const logs = await this.provider.getLogs(filter);
        const amountSum = new BN(0);
    
        logs.forEach((log: any) => {
            const data = utils.defaultAbiCoder.decode(
                DepositContract.abi[0].inputs.map((parameter: any) => parameter.type),
                log.data
            );
    
            const validatorPubKey = data[PUBKEY_INDEX];
    
            if (validatorPubKey === this.signingKey.publicKey.toHexString()) {
                const amount = deserialize(
                    Buffer.from(data[DATA_INDEX].slice(2), "hex"), 
                    this.config.types.Gwei) as Gwei;
                amountSum.iadd(amount);
            }
        });
    
        return amountSum.cmp(DEPOSIT_AMOUNT_GWEI) === 1;
    }
}