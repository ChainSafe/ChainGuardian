import { Keypair } from "@chainsafe/bls/lib/keypair";

export interface IService {
    start(): Promise<void>;

    stop(): Promise<void>;
}


export interface ICGKeystore {
    decrypt(password: string): Keypair;
    changePassword(oldPassword: string, newPassword: string): void;
    destroy(): void;
}

/********************
 * Keystore interfaces
 * *******************/
interface PBKDFParamsOut {
    c: number;
    dklen: number;
    prf: string;
    salt: string;
}
interface ScryptKDFParamsOut {
    dklen: number;
    n: number;
    p: number;
    r: number;
    salt: string;
}

type KDFParamsOut = ScryptKDFParamsOut | PBKDFParamsOut;

// https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
export interface V3Keystore {
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
