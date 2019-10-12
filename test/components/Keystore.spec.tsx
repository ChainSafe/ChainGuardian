import { ICGKeystore } from '../../src/renderer/services/interface';
import { Eth1ICGKeystore } from '../../src/renderer/services/Eth1ICGKeystore';
import { PrivateKey } from '@chainsafe/bls/lib/privateKey';
import { PublicKey } from '@chainsafe/bls/lib/publicKey';
import { Keypair } from '@chainsafe/bls/lib/keypair';
const eth1WalletProvider = require('ethereumjs-wallet');
import * as fs from 'fs';

const privateKey = '0e43429c844ccedd4aff7aaa05fe996f41f9464b360ca03a4349387ba49b3e18';
const privateKeyStr = `0x${privateKey}`;

const keyStoreFilePath = `test/components/${getV3Filename()}.json`;
const password = 'test';
const newPassword = 'newTest';

function getV3Filename(timestamp?: number) {
    const ts = timestamp ? new Date(timestamp) : new Date();
    return ['UTC--', ts.toJSON().replace(/:/g, '-'), '--', 'uuid'].join('');
}

describe('Eth1ICGKeystore', () => {
    let eth1Keystore: ICGKeystore = {} as ICGKeystore;

    it('should create keystore', () => {
        const priv = PrivateKey.fromHexString(privateKeyStr);
        const pub = PublicKey.fromBytes(PublicKey.fromPrivateKey(priv).toBytesCompressed());
        const keypair = new Keypair(priv, pub);
        eth1Keystore = Eth1ICGKeystore.create(keyStoreFilePath, password, keypair);
        expect(eth1Keystore).not.toEqual(null);
    });

    it('should decrypt', () => {
        const keypair = eth1Keystore.decrypt(password);
        expect(keypair.privateKey.toHexString()).toEqual(privateKeyStr);
    });

    it('should fail on decrypt with wrong password', () => {
        expect(() => eth1Keystore.decrypt('wrongPassword')).toThrow();
    });

    it('should get private key with changed password', () => {
        eth1Keystore.changePassword(password, newPassword);
        const keypair = eth1Keystore.decrypt(newPassword);
        expect(keypair.privateKey.toHexString()).toEqual(privateKeyStr);
    });

    it('should fail to encrypt private key with old password', () => {
        eth1Keystore.changePassword(newPassword, password);
        expect(() => eth1Keystore.decrypt('oldPassword')).toThrow(
            new Error('Key derivation failed - possibly wrong passphrase')
        );
    });

    it('should destroy file', () => {
        eth1Keystore.destroy();
        expect(fs.existsSync(keyStoreFilePath)).toEqual(false);
    });
});
