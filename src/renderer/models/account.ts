import {Keypair} from "@chainsafe/bls/lib/keypair";
import {readdirSync} from "fs";
import {ICGKeystore, ICGKeystoreFactory, V4KeystoreFactory} from "../services/keystore";

export interface IAccount {
    name: string;
    directory: string;
    sendStats: boolean | null;
}

export class CGAccount implements IAccount {
    public name: string;
    public directory: string;
    public sendStats: boolean | null;

    private validators: Keypair[] = [];
    private keystoreTarget: ICGKeystoreFactory;

    public constructor(
        account: IAccount,
        keystoreTarget: ICGKeystoreFactory = V4KeystoreFactory
    ) {
        this.name = account.name;
        // Add / to the end if not provided
        this.directory =
            account.directory + (account.directory.endsWith("/") ? "" : "/");
        this.sendStats = account.sendStats;
        this.keystoreTarget = keystoreTarget;
    }

    /**
   * should return addresses from validator keystores in account directory
   */
    public getValidatorsAddresses(): string[] {
        // Loop trough files in account directory
        const keystoreFiles: ICGKeystore[] = this.getKeystoreFiles();

        const validatorAddresses: string[] = keystoreFiles
            .map(keystore => keystore.getAddress());

        return validatorAddresses;
    }

    /**
   * returns all validator keypairs or throws if not unlocked
   * @param password decryption password of the keystore
   */
    public getValidators(): Keypair[] {
        if (!this.isUnlocked()) {
            throw new Error("Keystore locked.");
        }
        return this.validators;
    }

    /**
   * Check if password is valid
   * @param password decryption password of the keystore
   */
    public async isCorrectPassword(password: string): Promise<boolean> {
        /**
         * ? As there can be multiple keystore files there can also be
         * ? different passwords that these keystores use, we need to
         * ? define how are we going to handle these situations.
         * * Currently, if any of the keystores matches the provided
         * * password this method returns true.
         */

        const keystoreFiles = this.getKeystoreFiles();

        if (keystoreFiles.length <= 0) {
            return false;
        }

        /**
     * Check only first file as we assume that all keystores
     * have the same password.
     */
        const keystore = keystoreFiles[0];
        try {
            await keystore.decrypt(password);
        } catch (e) {
            // wrong password
            return false;
        }
        // error not detected, password correct
        return true;
    }

    /**
   * should try to decrypt keystores using given password,
   * throw exception if wrong password (save unlocked keypairs into private field)
   * @param password decryption password of the keystore
   */
    public async unlock(password: string): Promise<void> {
        const keystoreFiles = this.getKeystoreFiles();

        const validators: Promise<Keypair | undefined>[] = keystoreFiles.map(async keystore => {
            try {
                return await keystore.decrypt(password);
            } catch (e) {
                console.error(e);
                return undefined;
            }
        });
        for (const validatorIdx in validators) {
            const validator = await validators[validatorIdx];
            if (validator !== undefined) {
                this.validators.push(validator);
            }
        }
    }

    public addValidator(validator: Keypair): void {
        this.validators.push(validator);
    }
    public removeValidator(index: number): void {
        this.validators.splice(index, 1);
    }

    /**
   * delete all unlocked keypairs from object
   */
    public lock(): void {
        // Clear validator Keypairs
        this.validators = [];
    }

    private isUnlocked(): boolean {
        return this.validators.length > 0;
    }

    private getKeystoreFiles(): ICGKeystore[] {
        let keystores: string[] = [];
        try {
            keystores = readdirSync(this.directory);
            keystores = keystores
                .filter(file => {
                    return file.toLowerCase().endsWith(".json");
                })
                .map(file => this.directory + file);
        } catch (e) {
            console.log(e);
            return [];
        }

        return keystores
            .map(file => {
                try {
                    return new this.keystoreTarget(file);
                } catch (e) {
                    return null;
                }
            })
            .filter((keystore): keystore is ICGKeystore => keystore !== null);
    }
}
