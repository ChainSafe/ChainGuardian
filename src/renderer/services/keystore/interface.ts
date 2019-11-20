import {Keypair} from "@chainsafe/bls/lib/keypair";

export interface ICGKeystore {
    decrypt(password: string): Promise<Keypair>;
    changePassword(oldPassword: string, newPassword: string): Promise<void>;
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
    address: string;
}
/************************/