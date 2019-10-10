import { V3Keystore, V3Params } from './eth1/Eth1KeystoreInterfaces';
import { PrivateKey } from '@chainsafe/bls/lib/privateKey';
import { BLSPubkey, BLSSecretKey, BLSSignature } from '@chainsafe/bls/lib/types';
import { PublicKey } from '@chainsafe/bls/lib/publicKey';
import { Keypair } from '@chainsafe/bls/lib/keypair';
import { Hash } from '@chainsafe/eth2.0-types';

export type IKeystoreJson = V3Keystore;
export type KeystoreParams = V3Params;

export type Domain = Buffer;

export interface IKeystore {
    saveJSON(password: string, opts?: Partial<KeystoreParams>): IKeystoreJson;
    fromJSON(input: string, password: string): PrivateKey;
}

export interface IWalletService {
    getPrivateKey(): PrivateKey;
    getPublicKey(): PublicKey;
    getAddress(): string;
    getKeypair(): Keypair;
    getKeystore(): IKeystore;
    sign(secretKey: BLSSecretKey, messageHash: Hash, domain: Domain): BLSSignature;
    verify(publicKey: BLSPubkey, messageHash: Hash, signature: BLSSignature, domain: Domain): boolean;
    aggregatePubkeys(publicKeys: BLSPubkey[]): BLSPubkey;
    aggregateSignatures(signatures: BLSSignature[]): BLSSignature;
    verifyMultiple(publicKeys: BLSPubkey[], messageHashes: Hash[], signature: BLSSignature, domain: Domain): boolean;
}
