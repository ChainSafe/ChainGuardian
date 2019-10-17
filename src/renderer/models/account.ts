import { Keypair } from '@chainsafe/bls/lib/keypair';
import { readdirSync, readFileSync } from 'fs';
import { ICGKeystore, ICGType, ICGKeystoreFactory } from '../services/interfaces';

export interface SSZAccount {
    name: string;
    directory: string;
    sendStats: boolean;
}

export class CGAccount implements SSZAccount {
    public name: string;
    public directory: string;
    public sendStats: boolean;

    private unlocked: boolean = false;
    private validators: Keypair[] = [];
    private keystoreTarget: ICGKeystoreFactory;

    constructor(name: string, directory: string, sendStats: boolean = false, keystoreTarget: ICGKeystoreFactory) {
        this.name = name;
        // Add / to the end if not provided
        this.directory = directory + (directory.endsWith('/') ? '' : '/');
        this.sendStats = sendStats;
        this.keystoreTarget = keystoreTarget;
    }

    /**
     * should return addresses from validator keystores in account directory
     */
    getValidatorsAddresses(): string[] {
        // Loop trough files in account directory
        let keystoreFiles: string[] = this.getKeystoreFiles();

        let validatorAddresses: string[] = [];
        keystoreFiles.forEach(file => {
            const fileContents = readFileSync(this.directory + file);
            const fileJSON = JSON.parse(fileContents.toString());
            if (fileJSON.address) {
                validatorAddresses.push(fileJSON.address);
            }
        });
        return validatorAddresses;
    }

    /**
     * returns all validator keypairs or throws if not unlocked
     * @param password decryption password of the keystore
     */
    getValidators(password: string): Keypair[] {
        // TODO: loop trough keystore files and unlock them
        if (!this.unlocked) {
            throw new Error('Keystore locked.');
        }
        return this.validators;
    }

    /**
     * Check if password is valid
     * @param password decryption password of the keystore
     */
    isCorrectPassword(password: string): boolean {
        /**
         * ? As there can be multiple keystore files there can also be
         * ? different passwords that these keystores use, we need to
         * ? define how are we going to handle these situations.
         * * Currently, if any of the keystores matches the provided
         * * password this method returns true.
         */

        let keystoreFiles = this.getKeystoreFiles();

        for (let fileIdx in keystoreFiles) {
            const file = keystoreFiles[fileIdx];
            const filePath = this.directory + file;

            const keystore: ICGKeystore = new this.keystoreTarget(filePath);

            try {
                keystore.decrypt(password);
            } catch (e) {
                continue;
            }
            return true;
        }
        return false;
    }

    /**
     * should try to decrypt keystores using given password,
     * throw exception if wrong password (save unlocked keypairs into private field)
     * @param password decryption password of the keystore
     */
    unlock(password: string): void {
        let keystoreFiles = this.getKeystoreFiles();

        keystoreFiles.forEach(file => {
            const filePath = this.directory + file;
            const keystore = new this.keystoreTarget(filePath);

            try {
                const keypair = keystore.decrypt(password);

                this.validators.push(keypair);
                this.unlocked = true;
            } catch (e) {
                // Failed to unlock keystore, probably wrong password
                // Skip this keystore
                return;
            }
        });
    }

    /**
     * delete all unlocked keypairs from object
     */
    lock(): void {
        // Clear validator Keypairs
        this.validators = [];
        this.unlocked = false;
    }

    private getKeystoreFiles(): string[] {
        let keystores: string[] = [];
        try {
            keystores = readdirSync(this.directory);
            keystores = keystores.filter(file => {
                return file.toLowerCase().endsWith('.json');
            });
        } catch (e) {
            return [];
        }
        return keystores;
    }
}
