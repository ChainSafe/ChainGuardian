import {Keypair} from "@chainsafe/bls";

export interface ICGKeystore {
    getName(): string;
    decrypt(password: string): Promise<Keypair>;
    changePassword(oldPassword: string, newPassword: string): Promise<void>;
    destroy(): void;
    getPublicKey(): string;
}

export interface ICGKeystoreFactory {
    new (file: string): ICGKeystore;
}
