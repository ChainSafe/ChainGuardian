import { bool } from '@chainsafe/eth2.0-types';
import { IWallet, IWalletService } from '../../interface';
import { Eth1Wallet } from './Eth1Wallet';

const eth1WalletProvider = require('ethereumjs-wallet');

export class Eth1WalletService implements IWalletService {
    /**
     * Create an instance based on a new random key
     */
    generate(): IWallet {
        const eth1WalletInstance = eth1WalletProvider.generate();
        return this.createWalletInstance(eth1WalletInstance);
    }

    /**
     * Create an instance based on a raw private key
     *
     * @param privateKey
     */
    fromPrivateKey(privateKey: Buffer): IWallet {
        const eth1WalletInstance = eth1WalletProvider.fromPrivateKey(privateKey);
        return this.createWalletInstance(eth1WalletInstance);
    }

    /**
     * Create an instance based on a public key (certain methods will not be available)
     * @param publicKey
     * @param nonStrict
     */
    fromPublicKey(publicKey: Buffer, nonStrict: bool = false): IWallet {
        const eth1WalletInstance = eth1WalletProvider.fromPublicKey(publicKey, nonStrict);
        return this.createWalletInstance(eth1WalletInstance);
    }

    /**
     * Create an instance based on a BIP32 extended private key (xprv)
     * @param xPrivateKey extender private key
     */
    fromExtendedPrivateKey(xPrivateKey: String): IWallet {
        const eth1WalletInstance = eth1WalletProvider.fromExtendedPrivateKey(xPrivateKey);
        return this.createWalletInstance(eth1WalletInstance);
    }

    /**
     * Create an instance based on a BIP32 extended public key (xpub)
     * @param xPublicKey
     */
    fromExtendedPublicKey(xPublicKey: String): IWallet {
        const eth1WalletInstance = eth1WalletProvider.fromExtendedPublicKey(xPublicKey);
        return this.createWalletInstance(eth1WalletInstance);
    }

    /**
     * Import a wallet (Version 3 of the Ethereum wallet format).
     * Set nonStrict true to accept files with mixed-caps.
     * @param input keystore file in string format
     * @param password passphrase for KDF
     * @param nonStrict accept files with mixed-caps
     */
    fromV3(input: String, password: String, nonStrict: bool = false): IWallet {
        const eth1WalletInstance = eth1WalletProvider.fromV3(input, password, nonStrict);
        return this.createWalletInstance(eth1WalletInstance);
    }

    /**
     * Helper method for creating new wallet instance
     * @param providedInstance provided instance of wallet for Eth1Wallet constructor
     */
    private createWalletInstance(providedInstance: any): IWallet {
        return new Eth1Wallet(providedInstance);
    }
}
