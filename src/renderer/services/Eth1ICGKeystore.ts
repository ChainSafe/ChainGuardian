import { ICGKeystore } from './interface';
import { Keypair } from '@chainsafe/bls/lib/keypair';
import * as fs from 'fs';
import { PrivateKey } from '@chainsafe/bls/lib/privateKey';
import { PublicKey } from '@chainsafe/bls/lib/publicKey';
const eth1WalletProvider = require('ethereumjs-wallet');
const bech32 = require('bech32');

export class Eth1ICGKeystore implements ICGKeystore {
    keystore: any;
    file: string;

    constructor(file: string) {
        this.keystore = this.readKeystoreFile(file);
        this.file = file;
    }

    /**
     * Method used to decrypt encrypted private key from keystore file
     * @param password
     */
    decrypt(password: string): Keypair {
        const privateKeyString = eth1WalletProvider.fromV3(this.keystore, password).getPrivateKeyString();
        const priv = PrivateKey.fromHexString(privateKeyString);
        const pub = PublicKey.fromBytes(PublicKey.fromPrivateKey(priv).toBytesCompressed());
        return new Keypair(priv, pub);
    }

    /**
     * Replacing old password with new password which also change physical keystore file on disk
     *
     * @param oldPassword old password to decrypt private key
     * @param newPassword new password to encrypt private key
     */
    changePassword(oldPassword: string, newPassword: string): void {
        const keypair = this.decrypt(oldPassword);
        const keystore = Eth1ICGKeystore.createKeystoreObject(newPassword, keypair);

        try {
            fs.writeFileSync(this.file, JSON.stringify(keystore, null, 2));
            this.keystore = keystore;
        } catch (err) {
            throw new Error(`Failed to write to ${this.file}: ${err}`);
        }
    }

    /**
     * Deletes physical keystore file
     */
    destroy(): void {
        try {
            fs.unlinkSync(this.file);
        } catch (err) {
            throw new Error(`Failed to delete file ${this.file}: ${err}`);
        }
    }

    /**
     * Helper method to read file from path specified by @param file
     * @param file file path
     */
    readKeystoreFile(file: string) {
        try {
            const data = fs.readFileSync(file);
            return JSON.parse(data.toString());
        } catch (err) {
            throw new Error(`${file} could not be parsed`);
        }
    }

    /**
     * Helper static method to create keystore object from ethereumjs-wallet library.
     * @param password password for encryption
     * @param keypair private and public key
     */
    static createKeystoreObject(password: string, keypair: Keypair) {
        const keystore = eth1WalletProvider
            .fromPrivateKey(keypair.privateKey.toBytes())
            .toV3(password, { kdf: 'pbkdf2' });
        return {
            ...keystore,
            address: bech32.toWords(keypair.publicKey.toBytesCompressed())
        };
    }

    /**
     * Static method to create keystore file and ICGKeystore instance
     * @param file file path
     * @param password password for encryption
     * @param keypair private and public key
     */
    static create(file: string, password: string, keypair: Keypair): ICGKeystore {
        try {
            const keystore = Eth1ICGKeystore.createKeystoreObject(password, keypair);
            fs.writeFileSync(file, JSON.stringify(keystore, null, 2));
            return new Eth1ICGKeystore(file);
        } catch (err) {
            throw new Error(`Failed to write to ${file}: ${err}`);
        }
    }
}
