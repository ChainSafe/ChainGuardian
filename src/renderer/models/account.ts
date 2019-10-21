import {Keypair} from "@chainsafe/bls/lib/keypair";
import {readdirSync} from "fs";
import {ICGKeystoreFactory} from "../services/interfaces";
import {Eth1ICGKeystoreFactory} from "../services/Eth1ICGKeystore";

export interface IAccount {
    name: string;
    directory: string;
    sendStats: boolean;
}

export class CGAccount implements IAccount {
    public name: string;
    public directory: string;
    public sendStats: boolean;

    private validators: Keypair[] = [];
    private keystoreTarget: ICGKeystoreFactory;

    constructor(account: IAccount, keystoreTarget: ICGKeystoreFactory = Eth1ICGKeystoreFactory) {
        this.name = name;
        // Add / to the end if not provided
        this.directory = account.directory + (account.directory.endsWith("/") ? "" : "/");
        this.sendStats = account.sendStats;
        this.keystoreTarget = keystoreTarget;
    }

    /**
     * should return addresses from validator keystores in account directory
     */
    getValidatorsAddresses(): string[] {
        // Loop trough files in account directory
        const keystoreFiles: string[] = this.getKeystoreFiles();

        const validatorAddresses: string[] = keystoreFiles
            .map(file => new this.keystoreTarget(file))
            .map(keystore => keystore.getAddress());

        return validatorAddresses;
    }

    /**
     * returns all validator keypairs or throws if not unlocked
     * @param password decryption password of the keystore
     */
    // eslint-disable-next-line
    getValidators(password: string): Keypair[] {
        if (! this.isUnlocked()) {
            throw new Error("Keystore locked.");
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

        const keystoreFiles = this.getKeystoreFiles();

        if(keystoreFiles.length <= 0){
            return false;
        }

        /**
         * Check only first file as we assume that all keystores
         * have the same password.
         */
        const keystore = new this.keystoreTarget(keystoreFiles[0]);
        try{
            keystore.decrypt(password);
        } catch(e){
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
    unlock(password: string): void {
        const keystoreFiles = this.getKeystoreFiles();

        const validators: (Keypair | undefined)[] = keystoreFiles
            .map(file => new this.keystoreTarget(file))
            .map(keystore => {
                try{
                    return keystore.decrypt(password);
                } catch(e){
                    return undefined;
                }
            });
        
        for(const validatorIdx in validators){
            const validator = validators[validatorIdx];
            if(validator !== undefined){
                this.validators.push(validator);
            }
        }
    }

    /**
     * delete all unlocked keypairs from object
     */
    lock(): void {
        // Clear validator Keypairs
        this.validators = [];
    }

    private isUnlocked(): boolean{
        return this.validators.length > 0;
    }

    private getKeystoreFiles(): string[] {
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
        return keystores;
    }
}
