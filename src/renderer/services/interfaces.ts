import {Keypair} from "@chainsafe/bls/lib/keypair";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import { CGAccount } from "../models/account";

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

export interface INetworkConfig {
    config: IBeaconConfig;
    contract: {
        address: string,
        bytecode: string,
        deployedAtBlock: number
    }
}

export interface IIpcDatabaseEntry {
    id: string,
    account: CGAccount
}