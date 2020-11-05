import {ICGKeystore, ICGKeystoreFactory} from "./interface";
import {Keypair} from "@chainsafe/bls";
import {existsSync, readFileSync, unlinkSync, writeFileSync, mkdirSync, copyFileSync} from "fs";
import {PrivateKey} from "@chainsafe/bls";
import {Keystore, IKeystore} from "@chainsafe/bls-keystore";
import {dirname} from "path";
import {warn} from "electron-log";

export class V4Keystore implements ICGKeystore {
    private keystore: Keystore;
    private readonly file: string;

    public constructor(file: string) {
        this.keystore = Keystore.fromObject(this.readKeystoreFile(file));
        this.file = file;
    }

    /**
     * Static method to create keystore file and ICGKeystore instance
     * @param file file path
     * @param password password for encryption
     * @param keypair private and public key
     * @param keyPath path used to generate key from mnemonic
     * @param name
     */
    public static async create(
        file: string, password: string, keypair: Keypair, keyPath: string, name = ""
    ): Promise<ICGKeystore> {
        try {
            const keystore = await Keystore.create(
                password,
                keypair.privateKey.toBytes(),
                keypair.publicKey.toBytesCompressed(),
                keyPath,
                name
            );
            ensureKeystoreDirectory(file);
            writeFileSync(file, keystore.stringify());
            return new V4Keystore(file);
        } catch (err) {
            throw new Error(`Failed to write to ${file}: ${err}`);
        }
    }

    /**
     * Helper method to move validate keystore and move to desired destination
     *
     * @param from where file will be copied
     * @param to where file will be stored
     * @param password to validate keystore
     */
    public static async import(from: string, to: string, password: string): Promise<ICGKeystore> {
        const keystore = new V4Keystore(from);
        if(!await keystore.verifyPassword(password)) {
            throw new Error("Wrong password");
        }
        try {
            ensureKeystoreDirectory(to);
            copyFileSync(from, to);
            return new V4Keystore(to);
        } catch (err) {
            throw new Error(`Failed to move file from ${from} to ${to}: ${err}`);
        }
    }

    /**
     * Method used to verify password of keystore file
     * @param password
     */
    public async verifyPassword(password: string): Promise<boolean> {
        return this.keystore.verifyPassword(password);
    }

    /**
     * Method used to decrypt encrypted private key from keystore file
     * @param password
     */
    public async decrypt(password: string): Promise<Keypair> {
        const privateKeyBuffer: Buffer = await this.keystore.decrypt(password);
        const priv = PrivateKey.fromBytes(privateKeyBuffer);
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
        const keystore = await Keystore.create(
            newPassword,
            keypair.privateKey.toBytes(),
            keypair.publicKey.toBytesCompressed(),
            this.keystore.path,
            this.keystore.description
        );
        try {
            ensureKeystoreDirectory(this.file);
            writeFileSync(this.file, keystore.stringify());
            this.keystore = keystore;
        } catch (err) {
            throw new Error(`Failed to write to ${this.file}: ${err}`);
        }
    }

    public getPublicKey(): string {
        return `0x${this.keystore.pubkey}`;
    }

    public getName(): string|null {
        return this.keystore.description;
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
    private readKeystoreFile(file: string): IKeystore {
        if (existsSync(file)) {
            try {
                const data = readFileSync(file);
                return JSON.parse(data.toString()) as IKeystore;
            } catch (err) {
                throw new Error(`${file} could not be parsed: ${err}`);
            }
        }
        throw new Error(`Cannot find file ${file}`);
    }
}

export const V4KeystoreFactory: ICGKeystoreFactory = V4Keystore;

function ensureKeystoreDirectory(file: string): void{
    try {
        mkdirSync(dirname(file), {recursive: true});
    }
    catch (err) {
        warn("ensuring directory exists", err);
    }
}
