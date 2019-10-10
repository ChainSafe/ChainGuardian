import bls from '@chainsafe/bls';
import { Keypair } from '@chainsafe/bls/lib/keypair';
import { BLSPubkey, BLSSecretKey, BLSSignature } from '@chainsafe/bls/lib/types';
import { PrivateKey } from '@chainsafe/bls/lib/privateKey';
import { PublicKey } from '@chainsafe/bls/lib/publicKey';
import Eth1Keystore from './eth1/Eth1Keystore';
import { Hash } from '@chainsafe/eth2.0-types';
import { Domain, IKeystore, IWalletService } from './WalletInterfaces';
const bech32 = require('bech32');

export class WalletService implements IWalletService {
    keypair: Keypair;
    keystore: IKeystore;

    constructor(keypair: Keypair) {
        this.keypair = keypair;
        // NOTE implement Eth2 Keystore when PR is resolved
        this.keystore = new Eth1Keystore(this.keypair);
    }

    getPrivateKey(): PrivateKey {
        return this.keypair.privateKey;
    }

    getPublicKey(): PublicKey {
        return this.keypair.publicKey;
    }

    getAddress(): string {
        // NOTE bech32 addres encoding (should be standard in eth2.0)
        const words = bech32.toWords(this.keypair.publicKey.toBytesCompressed());
        return bech32.encode('eth', words);
    }

    getKeypair(): Keypair {
        return this.keypair;
    }

    getKeystore(): IKeystore {
        return this.keystore;
    }

    sign(secretKey: BLSSecretKey, messageHash: Hash, domain: Domain): BLSSignature {
        return bls.sign(secretKey, messageHash, domain);
    }

    verify(publicKey: BLSPubkey, messageHash: Hash, signature: BLSSignature, domain: Domain): boolean {
        return bls.verify(publicKey, messageHash, signature, domain);
    }

    aggregatePubkeys(publicKeys: BLSPubkey[]): BLSPubkey {
        return bls.aggregatePubkeys(publicKeys);
    }

    aggregateSignatures(signatures: BLSSignature[]): BLSSignature {
        return bls.aggregateSignatures(signatures);
    }

    verifyMultiple(publicKeys: BLSPubkey[], messageHashes: Hash[], signature: BLSSignature, domain: Domain): boolean {
        return bls.verifyMultiple(publicKeys, messageHashes, signature, domain);
    }

    static generateKeypair(): WalletService {
        return new WalletService(bls.generateKeyPair());
    }

    static fromPrivateKeyHexString(privateKeyString: string): WalletService {
        const priv = PrivateKey.fromHexString(privateKeyString);
        const pub = PublicKey.fromBytes(PublicKey.fromPrivateKey(priv).toBytesCompressed());
        return new WalletService(new Keypair(priv, pub));
    }

    static generatePublicKey(secretKey: BLSSecretKey): BLSPubkey {
        return bls.generatePublicKey(secretKey);
    }
}
