import {Keypair} from "@chainsafe/bls";
import {readdirSync} from "fs";

import {getEth2ApiClient} from "../services/eth2/client";
import {ICGKeystore, ICGKeystoreFactory, V4KeystoreFactory} from "../services/keystore";
import {BeaconNode} from "./beaconNode";
import database from "../services/db/api/database";
import {IValidatorNetwork} from "./network";
import {error} from "electron-log";

export interface IAccount {
    name: string;
    directory: string;
    sendStats: boolean | null;
}

export class CGAccount implements IAccount {
    public name: string;
    public directory: string;
    public sendStats: boolean | null;

    private validators: ICGKeystore[] = [];
    private keystoreTarget: ICGKeystoreFactory;
    private validatorsNetwork: IValidatorNetwork = {};

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
   * returns all validators addresses
   */
    public getValidators(): ICGKeystore[] {
        return this.validators;
    }

    public async loadValidators(): Promise<ICGKeystore[]> {
        this.validators = this.getKeystoreFiles();

        for (const validator of this.validators) {
            const validatorAddress = validator.getPublicKey();
            await this.loadValidatorNetwork(validatorAddress);
        }

        return this.validators;
    }

    public getValidatorNetwork(validatorAddress: string): string {
        return this.validatorsNetwork[validatorAddress];
    }

    /**
     * Returns array of beacon nodes that validator uses.
     */
    public async getValidatorBeaconNodes(validatorAddress: string): Promise<BeaconNode[]> {
        const loadedNodes = await database.beaconNodes.get(validatorAddress);
        if (loadedNodes) {
            // In case we don't have enough information to fetch status, return basic info.
            const currentNetwork = await database.validator.network.get(validatorAddress);
            if (!currentNetwork) {
                return loadedNodes.nodes;
            }

            return await Promise.all(
                loadedNodes.nodes.map(async(node: BeaconNode): Promise<BeaconNode> => {
                    const beaconNode = getEth2ApiClient(node.url, currentNetwork.name);
                    return {
                        ...node,
                        client: beaconNode,
                    };
                })
            );
        }
        return [];
    }

    /**
   * should try to decrypt keystores using given password,
   * throw exception if wrong password (save unlocked keypairs into private field)
   * @param password decryption password of the keystore
   * @param keystore keystore that should be descryted
   */
    public async unlockKeystore(password: string, keystore: ICGKeystore): Promise<Keypair|undefined> {
        try {
            return await keystore.decrypt(password);
        } catch (e) {
            return undefined;
        }
    }

    public removeValidator(index: number): void {
        this.validators.splice(index, 1);
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
            error(e);
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

    private async loadValidatorNetwork(validatorAddress: string): Promise<void> {
        const network = await database.validator.network.get(validatorAddress);
        this.validatorsNetwork[validatorAddress] = network ? network.name : "";
    }
}
