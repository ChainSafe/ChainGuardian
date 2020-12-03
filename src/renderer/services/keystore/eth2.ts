import {SecretKey} from "@chainsafe/bls";
import {IKeystore, Keystore} from "@chainsafe/bls-keystore";
import {warn} from "electron-log";
import {existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync} from "fs";
import {dirname} from "path";
import {BlsKeypair} from "../../types/keys";
import {ICGKeystore, ICGKeystoreFactory} from "./interface";

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
        file: string,
        password: string,
        keypair: BlsKeypair,
        keyPath: string,
        name = "",
    ): Promise<ICGKeystore> {
        try {
            const keystore = await Keystore.create(
                password,
                keypair.privateKey.toBytes(),
                keypair.publicKey.toBytes(),
                keyPath,
                name,
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
     * @param name change description to be displayed as name at validator list
     * @param newPassword new password after file is imported
     */
    public static async import(
        from: string,
        to: string,
        password: string,
        name = "",
        newPassword?: string,
    ): Promise<ICGKeystore> {
        if (!(await new V4Keystore(from).verifyPassword(password))) {
            throw new Error("Invalid password");
        }
        try {
            ensureKeystoreDirectory(to);
            const keystoreObject = Keystore.parse(readFileSync(from).toString());
            keystoreObject.description = name;
            writeFileSync(to, keystoreObject.stringify());
            const keystore = new V4Keystore(to);
            if (newPassword) {
                await keystore.changePassword(password, newPassword);
            }
            return keystore;
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
    public async decrypt(password: string): Promise<BlsKeypair> {
        const privateKeyBuffer: Buffer = await this.keystore.decrypt(password);
        const priv = SecretKey.fromBytes(privateKeyBuffer);
        return {
            privateKey: priv,
            publicKey: priv.toPublicKey(),
        };
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
            keypair.publicKey.toBytes(),
            this.keystore.path,
            this.keystore.description,
        );
        try {
            ensureKeystoreDirectory(this.file);
            writeFileSync(this.file, keystore.stringify());
            this.keystore = keystore;
        } catch (err) {
            throw new Error(`Failed to write to ${this.file}: ${err}`);
        }
    }

    public getPath(): string {
        return this.keystore.path;
    }

    public getPublicKey(): string {
        return `0x${this.keystore.pubkey}`;
    }

    public getName(): string | null {
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

function ensureKeystoreDirectory(file: string): void {
    try {
        mkdirSync(dirname(file), {recursive: true});
    } catch (err) {
        warn("ensuring directory exists", err);
    }
}
