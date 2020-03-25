import {Keypair} from "@chainsafe/bls";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {CGAccount} from "../models/account";
import {BaseProvider} from "ethers/providers";

export interface IService {
    start(): Promise<void>;

    stop(): Promise<void>;
}

export interface ICGKeystore {
    decrypt(password: string): Keypair;
    changePassword(oldPassword: string, newPassword: string): void;
    destroy(): void;
    getAddress(): string;
}

export interface ICGKeystoreFactory {
    new (file: string): ICGKeystore;
}

export interface INetworkConfig {
    eth2Config: IBeaconConfig;
    networkId: number;
    networkName: string;
    eth1Provider: BaseProvider;
    contract: {
        address: string,
        bytecode: string,
        depositAmount: string|number;
        deployedAtBlock: number
    }
}