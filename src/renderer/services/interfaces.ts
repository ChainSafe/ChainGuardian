import {Keypair} from "@chainsafe/bls/lib/keypair";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {CGAccount} from "../models/account";
import {BaseProvider} from "ethers/providers";
import {IDockerRunParams} from "./docker/type";

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


export interface IInputValidity{
    isValid: boolean
    message: string
}

/********************
 * Keystore interfaces
 * *******************/
interface IPBKDFParamsOut {
    c: number;
    dklen: number;
    prf: string;
    salt: string;
}
interface IScryptKDFParamsOut {
    dklen: number;
    n: number;
    p: number;
    r: number;
    salt: string;
}

type KDFParamsOut = IScryptKDFParamsOut | IPBKDFParamsOut;

// https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
export interface IV3Keystore {
    crypto: {
        cipher: string;
        cipherparams: {
            iv: string;
        };
        ciphertext: string;
        kdf: string;
        kdfparams: KDFParamsOut;
        mac: string;
    };
    id: string;
    version: number;
    address: string;
}
/************************/

export interface IDockerConfig extends IDockerRunParams {
    volumeName: string;
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
    };
    dockerConfig: IDockerConfig;
}

export interface IIpcDatabaseEntry {
    id: string,
    account: CGAccount
}
