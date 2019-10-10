import { V3ParamsStrict, PBKDFParams, ScryptKDFParams, V3Params } from './Eth1KeystoreInterfaces';
import * as crypto from 'crypto';
import { KeystoreParams } from '../WalletInterfaces';

export class Eth1KeystoreHelper {
    static kdfParamsForPBKDF(opts: V3ParamsStrict): PBKDFParams {
        return {
            dklen: opts.dklen,
            salt: opts.salt,
            c: opts.c,
            prf: 'hmac-sha256'
        };
    }

    static kdfParamsForScrypt(opts: V3ParamsStrict): ScryptKDFParams {
        return {
            dklen: opts.dklen,
            salt: opts.salt,
            n: opts.n,
            r: opts.r,
            p: opts.p
        };
    }

    static validateHexString(paramName: string, str: string, length?: number) {
        let newStr = str;
        if (newStr.toLowerCase().startsWith('0x')) {
            newStr = newStr.slice(2);
        }
        if (!newStr && !length) {
            return newStr;
        }
        if ((length as number) % 2) {
            throw new Error(`Invalid length argument, must be an even number`);
        }
        if (typeof length === 'number' && newStr.length !== length) {
            throw new Error(`Invalid ${paramName}, string must be ${length} hex characters`);
        }
        if (!/^([0-9a-f]{2})+$/i.test(newStr)) {
            const howMany = typeof length === 'number' ? length : 'empty or a non-zero even number of';
            throw new Error(`Invalid ${paramName}, string must be ${howMany} hex characters`);
        }
        return newStr;
    }

    static validateBuffer(paramName: string, buff: Buffer, length?: number) {
        if (!Buffer.isBuffer(buff)) {
            const howManyHex = typeof length === 'number' ? `${length * 2}` : 'empty or a non-zero even number of';
            const howManyBytes = typeof length === 'number' ? ` (${length} bytes)` : '';
            throw new Error(
                `Invalid ${paramName}, must be a string (${howManyHex} hex characters) or buffer${howManyBytes}`
            );
        }
        if (typeof length === 'number' && buff.length !== length) {
            throw new Error(`Invalid ${paramName}, buffer must be ${length} bytes`);
        }
        return buff;
    }

    static mergeToV3ParamsWithDefaults(params?: Partial<KeystoreParams>): V3ParamsStrict {
        const v3Defaults: V3ParamsStrict = {
            cipher: 'aes-128-ctr',
            kdf: 'scrypt',
            salt: crypto.randomBytes(32),
            iv: crypto.randomBytes(16),
            uuid: crypto.randomBytes(16),
            dklen: 32,
            c: 262144,
            n: 262144,
            r: 8,
            p: 1
        };

        if (!params) {
            return v3Defaults;
        }

        if (typeof params.salt === 'string') {
            params.salt = Buffer.from(Eth1KeystoreHelper.validateHexString('salt', params.salt), 'hex');
        }
        if (typeof params.iv === 'string') {
            params.iv = Buffer.from(Eth1KeystoreHelper.validateHexString('iv', params.iv, 32), 'hex');
        }
        if (typeof params.uuid === 'string') {
            params.uuid = Buffer.from(Eth1KeystoreHelper.validateHexString('uuid', params.uuid, 32), 'hex');
        }

        if (params.salt) {
            this.validateBuffer('salt', params.salt);
        }
        if (params.iv) {
            this.validateBuffer('iv', params.iv, 16);
        }
        if (params.uuid) {
            this.validateBuffer('uuid', params.uuid, 16);
        }

        return {
            ...v3Defaults,
            ...(params as V3ParamsStrict)
        };
    }

    static runCipherBuffer(cipher: crypto.Cipher | crypto.Decipher, data: Buffer): Buffer {
        return Buffer.concat([cipher.update(data), cipher.final()]);
    }
}
