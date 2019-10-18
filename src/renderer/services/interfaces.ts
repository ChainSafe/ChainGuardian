import {Keypair} from "@chainsafe/bls/lib/keypair";
import {bytes} from "@chainsafe/eth2.0-types";

export interface IService {
    start(): Promise<void>;

    stop(): Promise<void>;
}

/*
export interface ICGKeystore {
    decrypt(password: string): Keypair;
    changePassword(oldPassword: string, newPassword: string): void;
    getAddress(): string;
    //deletes physical keystore file
    destroy(): void;
    create(file: string, password: string, keypair: Keypair): ICGKeystore;
}

export interface ICGKeystoreFactory {
    new (file: string): ICGKeystore;
}

export interface IEth2HDWallet {
    // should return mnemonic
    generate(entropy?: bytes): string;

    getKeypair(mnemonic: string, walletIndex?: number): Keypair;
}

export interface ICGType<T> {
    new (...args: any[]): T;
}
*/

export interface ICGKeystore {
    decrypt(password: string): Keypair;
    changePassword(oldPassword: string, newPassword: string): void;
    destroy(): void;
    getAddress(): string;
}

export interface ICGKeystoreFactory {
    new (file: string): ICGKeystore;
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
}
/************************/
