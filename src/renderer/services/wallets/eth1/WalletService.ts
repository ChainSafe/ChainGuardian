import bls from '@chainsafe/bls';
import { Keypair } from '@chainsafe/bls/lib/keypair';
import { BLSPubkey, BLSSecretKey } from '@chainsafe/bls/lib/types';

export class WalletService {
    generateKeypair(): Keypair {
        return bls.generateKeyPair();
    }

    generatePublicKey(secretKey: BLSSecretKey): BLSPubkey {
        return bls.generatePublicKey(secretKey);
    }
}
