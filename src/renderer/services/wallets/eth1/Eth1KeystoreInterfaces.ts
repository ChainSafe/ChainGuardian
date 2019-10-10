export interface ScryptKDFParams {
    dklen: number;
    n: number;
    p: number;
    r: number;
    salt: Buffer;
}

export interface ScryptKDFParamsOut {
    dklen: number;
    n: number;
    p: number;
    r: number;
    salt: string;
}

export interface PBKDFParams {
    c: number;
    dklen: number;
    prf: string;
    salt: Buffer;
}

export interface PBKDFParamsOut {
    c: number;
    dklen: number;
    prf: string;
    salt: string;
}

export type KDFParams = ScryptKDFParams | PBKDFParams;
export type KDFParamsOut = ScryptKDFParamsOut | PBKDFParamsOut;

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

export interface V3Params {
    kdf: string;
    cipher: string;
    salt: string | Buffer;
    iv: string | Buffer;
    uuid: string | Buffer;
    dklen: number;
    c: number;
    n: number;
    r: number;
    p: number;
}

export interface V3ParamsStrict {
    kdf: string;
    cipher: string;
    salt: Buffer;
    iv: Buffer;
    uuid: Buffer;
    dklen: number;
    c: number;
    n: number;
    r: number;
    p: number;
}

export const enum KDFFunctions {
    PBKDF = 'pbkdf2',
    Scrypt = 'scrypt'
}
