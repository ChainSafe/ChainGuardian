import {Contract, ethers, utils} from "ethers";
import {bool, Gwei} from "@chainsafe/eth2.0-types";
import DepositContract from "./options";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import {deserialize} from "@chainsafe/ssz";
import BN from "bn.js";
import {INetworkConfig} from "../interfaces";
import {warn} from "electron-log";
import {Arrayish, ParamType} from "ethers/utils";
import {etherToGwei} from "./utils";

const PUBKEY_INDEX = 0;
const DATA_INDEX = 2;
const DEPOSIT_EVENT = "DepositEvent";
export const DEPOSIT_EVENT_TIMEOUT_MESSAGE = "Timeout waiting for deposit event";

export class EthersNotifier {
    private networkConfig: INetworkConfig;
    private provider: ethers.providers.BaseProvider;
    private signingKey: Keypair;

    public constructor(networkConfig: INetworkConfig, provider: ethers.providers.BaseProvider, signingKey: Keypair) {
        this.networkConfig = networkConfig;
        this.provider = provider;
        this.signingKey = signingKey;
    }

    public depositEventListener(timeout: number): Promise<BN>{
        return new Promise((resolve, reject) => {
            const contract = new Contract(this.networkConfig.contract.address, DepositContract.abi, this.provider);
            const filter = contract.filters.DepositEvent(null);
    
            // Listen for our filtered results
            contract.on(filter, (pubkey, withdrawalCredentials, amount) => {
                if (pubkey === this.signingKey.publicKey.toHexString()) {
                    const amountGwei = deserialize(
                        Buffer.from(amount.slice(2), "hex"), this.networkConfig.eth2Config.types.Gwei
                    ) as Gwei;
                    clearTimeout(timer);
                    contract.removeAllListeners(DEPOSIT_EVENT);
                    resolve(amountGwei);
                }
            });

            const timer = setTimeout(() => {
                contract.removeAllListeners(DEPOSIT_EVENT);
                reject(new Error(DEPOSIT_EVENT_TIMEOUT_MESSAGE));
            }, timeout);
        });
    }

    public async checkUserDepositAmount(): Promise<bool> {
        try {
            const filter = {
                fromBlock: this.networkConfig.contract.deployedAtBlock,
                address: this.networkConfig.contract.address
            };
            const logs = await this.provider.getLogs(filter);
            const amountSum = new BN(0);
            logs.forEach((log: Arrayish) => {
                const data = utils.defaultAbiCoder.decode(
                    DepositContract.abi[0].inputs.map((parameter: ParamType) => parameter.type),
                    log.data
                );

                const validatorPubKey = data[PUBKEY_INDEX];

                if (validatorPubKey === this.signingKey.publicKey.toHexString()) {
                    const amount = deserialize(
                        Buffer.from(data[DATA_INDEX].slice(2), "hex"),
                        this.networkConfig.eth2Config.types.Gwei) as Gwei;
                    amountSum.iadd(amount);
                }
            });

            return amountSum.gte(etherToGwei(this.networkConfig.contract.depositAmount));
        } catch (e) {
            warn("Failed to get eth1 deposit logs. Reason: " + e.message);
            return false;
        }

    }
}