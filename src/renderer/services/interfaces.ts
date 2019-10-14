import { Keypair } from '@chainsafe/bls/lib/keypair';
import { bytes } from '@chainsafe/eth2.0-types';

export interface IService {
    start(): Promise<void>;

    stop(): Promise<void>;
}

export interface ICGKeystore {
    new (file: string): ICGKeystore;
    decrypt(password: string): Keypair;
    changePassword(oldPassword: string, newPassword: string): void;
    //deletes physical keystore file
    destroy(): void;
    create(file: string, password: string, keypair: Keypair): ICGKeystore;
}

export interface IEth2HDWallet {
    // should return mnemonic
    generate(entropy?: bytes): string;
 
    getKeypair(mnemonic: string, walletIndex?: number): Keypair;
 }
