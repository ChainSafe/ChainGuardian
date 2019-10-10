/* tslint:disable */
import { WalletService } from '../../src/renderer/services/wallets/WalletService';
import { PrivateKey } from '@chainsafe/bls/lib/privateKey';
import { sha256 } from 'ethereumjs-util';

const privateKey = '0e43429c844ccedd4aff7aaa05fe996f41f9464b360ca03a4349387ba49b3e18';
const privateKeyStr = `0x${privateKey}`;
const privateKeyBuffer = Buffer.from(privateKey, 'hex');

const walletServiceInstance = WalletService.fromPrivateKeyHexString(privateKey);

describe('.generateKeypair()', () => {
    const keypair = walletServiceInstance.getKeypair();
    const priv = keypair.privateKey;
    const pub = keypair.publicKey;

    it('should work', () => {
        expect(priv).not.toEqual(pub);
    });

    it('should be corret length', () => {
        expect(priv.toBytes().length).toEqual(32);
    });
});

describe('.fromPrivateKeyHexString', () => {
    const walletService = WalletService.fromPrivateKeyHexString(privateKey);
    it('should work', () => {
        expect(walletService.getPrivateKey().toHexString()).toEqual(privateKeyStr);
    });

    it('should public key be correct length', () => {
        expect(walletService.getPublicKey().toBytesCompressed().length).toEqual(48);
    });
});

describe('.generatePublicKey()', () => {
    const keypair = walletServiceInstance.getKeypair();
    const priv = keypair.privateKey;
    const pub = keypair.publicKey;

    it('should work', function() {
        const publicKey = WalletService.generatePublicKey(priv.toBytes());
        expect(pub.toBytesCompressed()).toEqual(publicKey);
    });

    it('should fail', () => {
        expect(pub.toBytesCompressed()).not.toEqual(Buffer.from('00', 'hex'));
    });
});

describe('saveToJson pbkdf2', () => {
    const salt = Buffer.from('dc9e4a98886738bd8aae134a1f89aaa5a502c3fbd10e336136d4d5fe47448ad6', 'hex');
    const iv = Buffer.from('cecacd85e9cb89788b5aab2f93361233', 'hex');
    const uuid = Buffer.from('7e59dc028d42d09db29aa8a0f862cc81', 'hex');
    const keystore = walletServiceInstance.getKeystore();

    it('should work', () => {
        const w =
            '{"version":3,"id":"7e59dc02-8d42-409d-b29a-a8a0f862cc81","address":"eth15ykgv2ju99dkvkvf4jg9yvtk046jmuq0htfnx79g873vft8al7sy6thglx4fhf2qd6jlxhpgykcnv76nwan","crypto":{"ciphertext":"9b1e670df2f369aa4f77fe18e789a950aba22945201292c6b211f741f678ace0","cipherparams":{"iv":"cecacd85e9cb89788b5aab2f93361233"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"dc9e4a98886738bd8aae134a1f89aaa5a502c3fbd10e336136d4d5fe47448ad6","c":262144,"prf":"hmac-sha256"},"mac":"6b93be8c24465e963f8fdd39c5886c44b3137fc0eaa4a844704aa996031ee66b"}}';
        const result = keystore.saveJSON('test', { kdf: 'pbkdf2', uuid, salt, iv });
        expect(result).toEqual(JSON.parse(w));
    });

    it('should fail wrong key derivation function', () => {
        expect(() => keystore.saveJSON('test', { kdf: 'unknown', uuid, salt, iv })).toThrow(
            new Error('Unsupported kdf')
        );
    });
});

/* // NOTE take to long for execute
describe('saveToJson scrypt', () => {
   it('should work', () => {
       const salt = Buffer.from('dc9e4a98886738bd8aae134a1f89aaa5a502c3fbd10e336136d4d5fe47448ad6', 'hex');
       const iv = Buffer.from('cecacd85e9cb89788b5aab2f93361233', 'hex');
       const uuid = Buffer.from('7e59dc028d42d09db29aa8a0f862cc81', 'hex');
       const keystore = walletServiceInstance.getKeystore()
       const w = '{"version":3,"id":"7e59dc02-8d42-409d-b29a-a8a0f862cc81","address":"0xa12c862a5c295b665989ac905231767d752df00fbad33378a83fa2c4acfdffa04d2ee8f9aa9ba5406ea5f35c2825b136","crypto":{"ciphertext":"724d8b5aeccb4afed3f83e31737dcb288084ad323c9c079d7bc8e67eaa1ab3a4","cipherparams":{"iv":"cecacd85e9cb89788b5aab2f93361233"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"dc9e4a98886738bd8aae134a1f89aaa5a502c3fbd10e336136d4d5fe47448ad6","n":262144,"r":8,"p":1},"mac":"87d609e03ff853d7de2d74fc7a9c56d3749acae80b83519db0de04334d5d14ec"}}'
       const result = keystore.saveJSON('test', { kdf: 'scrypt', uuid, salt, iv })
       expect(result).toEqual(JSON.parse(w))
   })
})
*/

describe('fromJson pbkdf2', () => {
    var keystore = walletServiceInstance.getKeystore();
    var priv = PrivateKey.fromHexString(privateKey);
    const w =
        '{"version":3,"id":"7e59dc02-8d42-409d-b29a-a8a0f862cc81","address":"eth15ykgv2ju99dkvkvf4jg9yvtk046jmuq0htfnx79g873vft8al7sy6thglx4fhf2qd6jlxhpgykcnv76nwan","crypto":{"ciphertext":"9b1e670df2f369aa4f77fe18e789a950aba22945201292c6b211f741f678ace0","cipherparams":{"iv":"cecacd85e9cb89788b5aab2f93361233"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"dc9e4a98886738bd8aae134a1f89aaa5a502c3fbd10e336136d4d5fe47448ad6","c":262144,"prf":"hmac-sha256"},"mac":"6b93be8c24465e963f8fdd39c5886c44b3137fc0eaa4a844704aa996031ee66b"}}';

    it('should work', () => {
        const result = keystore.fromJSON(w, 'test');
        expect(result).toEqual(priv);
    });

    it('should fail because of wrong password', () => {
        expect(() => keystore.fromJSON(w, 'wrongpassword')).toThrow();
    });
});
/* // NOTE take to long for execute
describe('fromJson scrypt', () => {
    it('should work', () => {
        const keystore = walletServiceInstance.getKeystore()
        const priv = PrivateKey.fromHexString(privateKey)
        const w = '{"version":3,"id":"7e59dc02-8d42-409d-b29a-a8a0f862cc81","address":"0xa12c862a5c295b665989ac905231767d752df00fbad33378a83fa2c4acfdffa04d2ee8f9aa9ba5406ea5f35c2825b136","crypto":{"ciphertext":"724d8b5aeccb4afed3f83e31737dcb288084ad323c9c079d7bc8e67eaa1ab3a4","cipherparams":{"iv":"cecacd85e9cb89788b5aab2f93361233"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"dc9e4a98886738bd8aae134a1f89aaa5a502c3fbd10e336136d4d5fe47448ad6","n":262144,"r":8,"p":1},"mac":"87d609e03ff853d7de2d74fc7a9c56d3749acae80b83519db0de04334d5d14ec"}}'
        const result = keystore.fromJSON(w, 'test')
        expect(result).toEqual(priv)
    })
})
*/

describe('verify', function() {
    const keypair = walletServiceInstance.getKeypair();
    const messageHash = Buffer.from(sha256('Test'));
    const domain = Buffer.alloc(8, 1);

    it('should verify signature', () => {
        const signature = walletServiceInstance.sign(keypair.privateKey.toBytes(), messageHash, domain);
        const result = walletServiceInstance.verify(
            keypair.publicKey.toBytesCompressed(),
            messageHash,
            signature,
            domain
        );
        expect(result).toBe(true);
    });

    it('should fail because wrong messageHash', () => {
        const signature = walletServiceInstance.sign(keypair.privateKey.toBytes(), messageHash, domain);
        const result = walletServiceInstance.verify(
            keypair.publicKey.toBytesCompressed(),
            Buffer.from(sha256('WrongMessageHash')),
            signature,
            domain
        );

        expect(result).toBe(false);
    });
});

describe('verify multiple', function() {
    it('should verify aggregated signatures', function() {
        const domain = Buffer.alloc(8, 0);

        const keypair1 = WalletService.generateKeypair().getKeypair();
        const keypair2 = WalletService.generateKeypair().getKeypair();
        const keypair3 = WalletService.generateKeypair().getKeypair();
        const keypair4 = WalletService.generateKeypair().getKeypair();

        const message1 = Buffer.from('Test1', 'utf-8');
        const message2 = Buffer.from('Test2', 'utf-8');

        const signature1 = keypair1.privateKey.signMessage(message1, domain);
        const signature2 = keypair2.privateKey.signMessage(message1, domain);
        const signature3 = keypair3.privateKey.signMessage(message2, domain);
        const signature4 = keypair4.privateKey.signMessage(message2, domain);

        const aggregatePubKey12 = walletServiceInstance.aggregatePubkeys([
            keypair1.publicKey.toBytesCompressed(),
            keypair2.publicKey.toBytesCompressed()
        ]);

        const aggregatePubKey34 = walletServiceInstance.aggregatePubkeys([
            keypair3.publicKey.toBytesCompressed(),
            keypair4.publicKey.toBytesCompressed()
        ]);

        const aggregateSignature = walletServiceInstance.aggregateSignatures([
            signature1.toBytesCompressed(),
            signature2.toBytesCompressed(),
            signature3.toBytesCompressed(),
            signature4.toBytesCompressed()
        ]);

        const result = walletServiceInstance.verifyMultiple(
            [aggregatePubKey12, aggregatePubKey34],
            [message1, message2],
            aggregateSignature,
            domain
        );

        expect(result).toEqual(true);
    });
});
