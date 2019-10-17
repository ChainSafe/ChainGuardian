import { PrivateKey } from '@chainsafe/bls/lib/privateKey';
import { Keypair } from '@chainsafe/bls/lib/keypair';
import * as fs from 'fs';
import * as sinon from 'sinon';
import { Eth1ICGKeystore } from '../../src/renderer/services/Eth1ICGKeystore';
import { ICGKeystore } from '../../src/renderer/services/interface';

const privateKey = '0e43429c844ccedd4aff7aaa05fe996f41f9464b360ca03a4349387ba49b3e18';
const privateKeyStr = `0x${privateKey}`;

const keyStoreFilePath = `${getV3Filename()}.json`;
const password = 'test';
const newPassword = 'newTest';

function getV3Filename(timestamp?: number) {
    const ts = timestamp ? new Date(timestamp) : new Date();
    return ['UTC--', ts.toJSON().replace(/:/g, '-'), '--', 'uuid'].join('');
}

describe('Eth1ICGKeystore', () => {
    let eth1Keystore: ICGKeystore = {} as ICGKeystore;
    let sandbox: sinon.SinonSandbox;

    beforeAll(() => {
        sandbox = sinon.createSandbox();
        sandbox
            .stub(fs, 'existsSync')
            .withArgs(keyStoreFilePath)
            .returns(true);
    });

    afterAll(() => {
        sandbox.restore();
    });

    it('should create keystore', () => {
        const priv = PrivateKey.fromHexString(privateKeyStr);
        const keypair = new Keypair(priv);

        const writeStub = sandbox.stub(fs, 'writeFileSync');
        const readStub = sandbox
            .stub(fs, 'readFileSync')
            .withArgs(keyStoreFilePath)
            .returns(
                '{"version":3,"id":"c12d6151-1f90-426d-b9b0-e39f1bcf80bd","address":[20,4,22,8,12,10,18,28,5,5,13,22,12,22,12,9,21,18,8,5,4,12,11,22,15,21,26,18,27,28,0,15,23,11,9,19,6,30,5,8,7,30,17,12,9,11,7,29,31,30,16,4,26,11,23,8,31,6,21,9,23,9,10,0,13,26,18,31,6,23,1,8,4,22,24,19,12],"crypto":{"ciphertext":"e04dc10b2821d90e293df239d63e8facce5aad9154dcf7a14305f7e25e69289d","cipherparams":{"iv":"62bd08907cd3f1b79db6c733ff7045de"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"f94a06f3e07ac0943184a59215c5b63872057af5fc7d58882b0ae186b1e49896","c":262144,"prf":"hmac-sha256"},"mac":"4c7f2569c4e07adb55a496aeabe0605096708e9f893ddd47b9bff1444534dff0"}}'
            );

        eth1Keystore = Eth1ICGKeystore.create(keyStoreFilePath, password, keypair);
        expect(writeStub.calledOnce).toEqual(true);
        expect(readStub.calledOnce).toEqual(true);
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
        const unlinkStub = sandbox
            .stub(fs, 'unlinkSync')
            .withArgs(keyStoreFilePath)
            .returns(true);
        eth1Keystore.destroy();
        expect(unlinkStub.calledOnce).toEqual(true);
    });
});
