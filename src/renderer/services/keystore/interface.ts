import {BlsKeypair} from "../../types";

export interface ICGKeystore {
    getName(): string;
    getPath(): string;
    verifyPassword(password: string): Promise<boolean>;
    decrypt(password: string): Promise<BlsKeypair>;
    changePassword(oldPassword: string, newPassword: string): Promise<void>;
    destroy(): void;
    getPublicKey(): string;
}

export interface ICGKeystoreFactory {
    new (file: string): ICGKeystore;
}
