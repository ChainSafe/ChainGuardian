import {Contract, ethers, utils} from "ethers";
import {bool, Gwei} from "@chainsafe/eth2.0-types";
import DepositContract from "./options";
import {deserialize} from "@chainsafe/ssz";
import {INetworkConfig} from "../interfaces";
import {warn} from "electron-log";
import {ParamType} from "ethers/utils";
import {etherToGwei} from "./utils";
import {Log} from "ethers/providers/abstract-provider";
import {PublicKey} from "@chainsafe/bls";

const PUBKEY_INDEX = 0;
const DATA_INDEX = 2;
const DEPOSIT_EVENT = "DepositEvent";
export const DEPOSIT_EVENT_TIMEOUT_MESSAGE = "Timeout waiting for deposit event";

export interface IEth1Client {
    depositEventListener(validatorPublicKey: PublicKey, timeout?: number): Promise<bigint>;
    hasUserDeposited(validatorPublicKey: PublicKey): Promise<boolean>;
}

export class EthersNotifier implements IEth1Client{
    private networkConfig: INetworkConfig;
    private provider: ethers.providers.BaseProvider;

    public constructor(networkConfig: INetworkConfig, provider: ethers.providers.BaseProvider) {
        this.networkConfig = networkConfig;
        this.provider = provider;
    }

    public depositEventListener(validatorPublicKey: PublicKey, timeout = 20000): Promise<bigint>{
        return new Promise((resolve, reject) => {
            const contract = new Contract(this.networkConfig.contract.address, DepositContract.abi, this.provider);
            const filter = contract.filters.DepositEvent(null);
    
            // Listen for our filtered results
            contract.on(filter, (pubkey, withdrawalCredentials, amount) => {
                if (pubkey === validatorPublicKey.toHexString()) {
                    const amountGwei = deserialize(
                        this.networkConfig.eth2Config.types.Gwei,
                        Buffer.from(amount.slice(2), "hex")
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

    public async hasUserDeposited(validatorPublicKey: PublicKey): Promise<bool> {
        try {
            const filter = {
                fromBlock: this.networkConfig.contract.deployedAtBlock,
                address: this.networkConfig.contract.address
            };
            const logs = await this.provider.getLogs(filter);
            let amountSum = BigInt(0);
            logs.forEach((log: Log) => {
                const data = utils.defaultAbiCoder.decode(
                    DepositContract.abi[0].inputs.map((parameter: ParamType) => parameter.type),
                    log.data
                );

                const validatorPubKey = data[PUBKEY_INDEX];

                if (validatorPubKey === validatorPublicKey.toHexString()) {
                    const amount = deserialize(
                        this.networkConfig.eth2Config.types.Gwei,
                        Buffer.from(data[DATA_INDEX].slice(2), "hex")
                    ) as Gwei;
                    amountSum += amount;
                }
            });

            return amountSum >= etherToGwei(this.networkConfig.contract.depositAmount);
        } catch (e) {
            warn("Failed to get eth1 deposit logs. Reason: " + e.message);
            return false;
        }

    }
}