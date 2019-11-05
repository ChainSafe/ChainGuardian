import {ICGKeystore, ICGKeystoreFactory, IV3Keystore} from "./interface";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import {existsSync, readFileSync, unlinkSync, writeFileSync} from "fs";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import {ethers} from "ethers";

export class Eth1Keystore implements ICGKeystore {
    private keystore: IV3Keystore;
    private readonly file: string;

    public constructor(file: string) {
        this.keystore = this.readKeystoreFile(file);
        this.file = file;
    }

    /**
     * Helper static method to create keystore object from ethereumjs-wallet library.
     * @param password password for encryption
     * @param keypair private and public key
     */
    public static async createKeystoreObject(password: string, keypair: Keypair): Promise<IV3Keystore> {
        const w = new ethers.Wallet(keypair.privateKey.toBytes());
        return JSON.parse(await w.encrypt(password));
    }

    /**
     * Static method to create keystore file and ICGKeystore instance
     * @param file file path
     * @param password password for encryption
     * @param keypair private and public key
     */
    public static async create(file: string, password: string, keypair: Keypair): Promise<ICGKeystore> {
        try {
            const keystore = await Eth1Keystore.createKeystoreObject(password, keypair);
            writeFileSync(file, JSON.stringify(keystore, null, 2));
            return new Eth1Keystore(file);
        } catch (err) {
            throw new Error(`Failed to write to ${file}: ${err}`);
        }
    }

    /**
     * Method used to decrypt encrypted private key from keystore file
     * @param password
     */
    public async decrypt(password: string): Promise<Keypair> {
        const keystore = await ethers.Wallet.fromEncryptedJson(JSON.stringify(this.keystore), password);
        const privateKeyString = keystore.privateKey;
        const priv = PrivateKey.fromHexString(privateKeyString);
        return new Keypair(priv);
    }

    /**
     * Replacing old password with new password which also change physical keystore file on disk
     *
     * @param oldPassword old password to decrypt private key
     * @param newPassword new password to encrypt private key
     */
    public async changePassword(oldPassword: string, newPassword: string): Promise<void> {
        const keypair = await this.decrypt(oldPassword);
        const keystore = await Eth1Keystore.createKeystoreObject(newPassword, keypair);

        try {
            writeFileSync(this.file, JSON.stringify(keystore, null, 2));
            this.keystore = keystore;
        } catch (err) {
            throw new Error(`Failed to write to ${this.file}: ${err}`);
        }
    }

    public getAddress(): string {
        return this.keystore.address;
    }

    /**
     * Deletes physical keystore file
     */
    public destroy(): void {
        try {
            unlinkSync(this.file);
        } catch (err) {
            throw new Error(`Failed to delete file ${this.file}: ${err}`);
        }
    }

    /**
     * Helper method to read file from path specified by @param file
     * @param file file path
     */
    private readKeystoreFile(file: string): IV3Keystore {
        if (existsSync(file)) {
            try {
                const data = readFileSync(file);
                const rawKeystoreFile = JSON.parse(data.toString());
                if (typeof rawKeystoreFile.address !== "string") {
                    rawKeystoreFile.address = Buffer.from(rawKeystoreFile.address).toString();
                }
                return JSON.parse(data.toString());
            } catch (err) {
                throw new Error(`${file} could not be parsed`);
            }
        }
        throw new Error(`Cannot find file ${file}`);
    }
}

export const Eth1KeystoreFactory: ICGKeystoreFactory = Eth1Keystore;
