/* tslint:disable */
import { Eth1WalletService } from '../../src/renderer/services/wallets/eth1/Eth1WalletService';

const walletService = new Eth1WalletService();
const fixturePrivateKey = 'efca4cdd31923b50f4214af5d2ae10e7ac45a5019e9431cc195482d707485378';
const fixturePrivateKeyStr = `0x${fixturePrivateKey}`;
const fixturePrivateKeyBuffer = Buffer.from(fixturePrivateKey, 'hex');

const fixturePublicKey =
    '5d4392f450262b276652c1fc037606abac500f3160830ce9df53aa70d95ce7cfb8b06010b2f3691c78c65c21eb4cf3dfdbfc0745d89b664ee10435bb3a0f906c';
const fixturePublicKeyStr = `0x${fixturePublicKey}`;
const fixturePublicKeyBuffer = Buffer.from(fixturePublicKey, 'hex');

const fixtureWallet = walletService.fromPrivateKey(fixturePrivateKeyBuffer);

describe('.generate()', () => {
    const wallet = walletService.generate();

    it('should generate an account', () => {
        expect(wallet.getPrivateKey().length).toEqual(32);
    });
});

describe('.getPrivateKey()', () => {
    it('should work', () => {
        expect(fixtureWallet.getPrivateKey().toString('hex')).toEqual(fixturePrivateKey);
    });

    it('should fail', () => {
        expect(() => walletService.fromPrivateKey(Buffer.from('001122', 'hex'))).toThrow(
            new Error('Private key does not satisfy the curve requirements (ie. it is invalid)')
        );
    });
});

describe('.getPrivateKeyString()', () => {
    it('should work', () => {
        expect(fixtureWallet.getPrivateKeyString()).toEqual(fixturePrivateKeyStr);
    });
});

describe('.getPublicKey()', () => {
    it('should work', () => {
        expect(fixtureWallet.getPublicKey().toString('hex')).toEqual(fixturePublicKey);
    });
});

describe('.getPublicKeyString()', () => {
    it('should work', () => {
        expect(fixtureWallet.getPublicKeyString()).toEqual(fixturePublicKeyStr);
    });
});

describe('.getAddress()', () => {
    it('should work', () => {
        expect(fixtureWallet.getAddress().toString('hex')).toEqual('b14ab53e38da1c172f877dbc6d65e4a1b0474c3c');
    });
});

describe('.getAddressString()', () => {
    it('should work', () => {
        expect(fixtureWallet.getAddressString()).toEqual('0xb14ab53e38da1c172f877dbc6d65e4a1b0474c3c');
    });
});

describe('.getCheckSumAddressString()', () => {
    it('should work', () => {
        expect(fixtureWallet.getChecksumAddressString()).toEqual('0xB14Ab53E38DA1C172f877DBC6d65e4a1B0474C3c');
    });
});

// Certain methods will not be available
describe('public key only wallet', () => {
    const pubKey = Buffer.from(fixturePublicKey, 'hex');
    it('.fromPublicKey() should work', () => {
        expect(
            walletService
                .fromPublicKey(pubKey)
                .getPublicKey()
                .toString('hex')
        ).toEqual(fixturePublicKey);
    });

    it('.fromPublicKey() should not accept compressed keys in strict mode', () => {
        expect(() =>
            walletService.fromPublicKey(
                Buffer.from('030639797f6cc72aea0f3d309730844a9e67d9f1866e55845c5f7e0ab48402973d', 'hex')
            )
        ).toThrow(new Error('Invalid public key'));
    });

    it('.fromPublicKey() should accept compressed keys in non-strict mode', () => {
        expect(
            walletService
                .fromPublicKey(
                    Buffer.from('030639797f6cc72aea0f3d309730844a9e67d9f1866e55845c5f7e0ab48402973d', 'hex'),
                    true
                )
                .getPublicKey()
                .toString('hex')
        ).toEqual(
            '0639797f6cc72aea0f3d309730844a9e67d9f1866e55845c5f7e0ab48402973defa5cb69df462bcc6d73c31e1c663c225650e80ef14a507b203f2a12aea55bc1'
        );
    });

    it('.getAddress() should work', () => {
        expect(
            walletService
                .fromPublicKey(pubKey)
                .getAddress()
                .toString('hex')
        ).toEqual('b14ab53e38da1c172f877dbc6d65e4a1b0474c3c');
    });

    it('.getPrivateKey() should fail', () => {
        expect(() => walletService.fromPublicKey(pubKey).getPrivateKey()).toThrow(
            new Error('This is a public key only wallet')
        );
    });

    it('.toV3() should fail', () => {
        expect(() => walletService.fromPublicKey(pubKey).toV3('')).toThrow(
            new Error('This is a public key only wallet')
        );
    });
});

describe('.fromExtendedPrivateKey()', () => {
    it('should work', () => {
        const xprv =
            'xprv9s21ZrQH143K4KqQx9Zrf1eN8EaPQVFxM2Ast8mdHn7GKiDWzNEyNdduJhWXToy8MpkGcKjxeFWd8oBSvsz4PCYamxR7TX49pSpp3bmHVAY';
        expect(walletService.fromExtendedPrivateKey(xprv).getAddressString()).toEqual(
            '0xb800bf5435f67c7ee7d83c3a863269969a57c57c'
        );
    });
});

describe('.fromExtendedPublicKey()', () => {
    it('should work', () => {
        const xpub =
            'xpub661MyMwAqRbcGout4B6s29b6gGQsowyoiF6UgXBEr7eFCWYfXuZDvRxP9zEh1Kwq3TLqDQMbkbaRpSnoC28oWvjLeshoQz1StZ9YHM1EpcJ';
        expect(walletService.fromExtendedPublicKey(xpub).getAddressString()).toEqual(
            '0xb800bf5435f67c7ee7d83c3a863269969a57c57c'
        );
    });
});

describe('.getV3Filename()', () => {
    it('should work', () => {
        expect(fixtureWallet.getV3Filename(1457917509265)).toEqual(
            'UTC--2016-03-14T01-05-09.265Z--b14ab53e38da1c172f877dbc6d65e4a1b0474c3c'
        );
    });
});

describe('.toV3()', () => {
    const salt = Buffer.from('dc9e4a98886738bd8aae134a1f89aaa5a502c3fbd10e336136d4d5fe47448ad6', 'hex');
    const iv = Buffer.from('cecacd85e9cb89788b5aab2f93361233', 'hex');
    const uuid = Buffer.from('7e59dc028d42d09db29aa8a0f862cc81', 'hex');

    it('should work with PBKDF2', () => {
        const w =
            '{"version":3,"id":"7e59dc02-8d42-409d-b29a-a8a0f862cc81","address":"b14ab53e38da1c172f877dbc6d65e4a1b0474c3c","crypto":{"ciphertext":"01ee7f1a3c8d187ea244c92eea9e332ab0bb2b4c902d89bdd71f80dc384da1be","cipherparams":{"iv":"cecacd85e9cb89788b5aab2f93361233"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"dc9e4a98886738bd8aae134a1f89aaa5a502c3fbd10e336136d4d5fe47448ad6","c":262144,"prf":"hmac-sha256"},"mac":"0c02cd0badfebd5e783e0cf41448f84086a96365fc3456716c33641a86ebc7cc"}}';
        expect(fixtureWallet.toV3String('testtest', { kdf: 'pbkdf2', uuid, salt, iv })).toBe(w);
    });

    it('should work with Scrypt', () => {
        const w =
            '{"version":3,"id":"7e59dc02-8d42-409d-b29a-a8a0f862cc81","address":"b14ab53e38da1c172f877dbc6d65e4a1b0474c3c","crypto":{"ciphertext":"c52682025b1e5d5c06b816791921dbf439afe7a053abb9fac19f38a57499652c","cipherparams":{"iv":"cecacd85e9cb89788b5aab2f93361233"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"dc9e4a98886738bd8aae134a1f89aaa5a502c3fbd10e336136d4d5fe47448ad6","n":262144,"r":8,"p":1},"mac":"27b98c8676dc6619d077453b38db645a4c7c17a3e686ee5adaf53c11ac1b890e"}}';
        expect(fixtureWallet.toV3String('testtest', { kdf: 'scrypt', uuid, salt, iv })).toBe(w);
    });

    // NOTE take to long for executing
    /*
    it('should work without providing option', () => {
        expect(fixtureWallet.toV3('testtest').version).toEqual(3)
    });

    it('should fail for unsupported kdf', () => {
        expect(() => fixtureWallet.toV3('testtest', {kdf: 'unsupported_kdf'}))
        .toThrow(new Error("Unsupported kdf"))
    });
    */
});

describe('.fromV3()', () => {
    it('should work with PBKDF2', () => {
        // tslint:disable-next-line:max-line-length
        const w =
            '{"crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"6087dab2f9fdbbfaddc31a909735c1e6"},"ciphertext":"5318b4d5bcd28de64ee5559e671353e16f075ecae9f99c7a79a38af5f869aa46","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"ae3cd4e7013836a3df6bd7241b12db061dbe2c6785853cce422d148a624ce0bd"},"mac":"517ead924a9d0dc3124507e3393d175ce3ff7c1e96529c6c555ce9e51205e9b2"},"id":"3198bc9c-6672-5ab3-d995-4942343ae5b6","version":3}';
        const wallet = walletService.fromV3(w, 'testpassword');
        expect(wallet.getAddressString()).toEqual('0x008aeeda4d805471df9b2a5b0f38a0c3bcba786b');
    });

    // NOTE take to long for executing

    /*
    it('should work with Scrypt', () => {
        var w = '{"address":"2f91eb73a6cd5620d7abb50889f24eea7a6a4feb","crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"a2bc4f71e8445d64ceebd1247079fbd8"},"ciphertext":"6b9ab7954c9066fa1e54e04e2c527c7d78a77611d5f84fede1bd61ab13c51e3e","kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"r":1,"p":8,"salt":"caf551e2b7ec12d93007e528093697a4c68e8a50e663b2a929754a8085d9ede4"},"mac":"506cace9c5c32544d39558025cb3bf23ed94ba2626e5338c82e50726917e1a15"},"id":"1b3cad9b-fa7b-4817-9022-d5e598eb5fe3","version":3}';
        const wallet = walletService.fromV3(w, 'testtest')
        expect(wallet.getAddressString()).toEqual('0x2f91eb73a6cd5620d7abb50889f24eea7a6a4feb')
    });

    it('should fail with wrong password', () => {
        var w = '{"address":"2f91eb73a6cd5620d7abb50889f24eea7a6a4feb","crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"a2bc4f71e8445d64ceebd1247079fbd8"},"ciphertext":"6b9ab7954c9066fa1e54e04e2c527c7d78a77611d5f84fede1bd61ab13c51e3e","kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"r":1,"p":8,"salt":"caf551e2b7ec12d93007e528093697a4c68e8a50e663b2a929754a8085d9ede4"},"mac":"506cace9c5c32544d39558025cb3bf23ed94ba2626e5338c82e50726917e1a15"},"id":"1b3cad9b-fa7b-4817-9022-d5e598eb5fe3","version":3}';
        expect(() => walletService.fromV3(w, 'wrongpassword')).toThrow(new Error("Key derivation failed - possibly wrong passphrase"))
    });

    it('should work with \'unencrypted\' wallets', () => {
        const w = '{"address":"a9886ac7489ecbcbd79268a79ef00d940e5fe1f2","crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"c542cf883299b5b0a29155091054028d"},"ciphertext":"0a83c77235840cffcfcc5afe5908f2d7f89d7d54c4a796dfe2f193e90413ee9d","kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"r":1,"p":8,"salt":"699f7bf5f6985068dfaaff9db3b06aea8fe3dd3140b3addb4e60620ee97a0316"},"mac":"613fed2605240a2ff08b8d93ccc48c5b3d5023b7088189515d70df41d65f44de"},"id":"0edf817a-ee0e-4e25-8314-1f9e88a60811","version":3}';
        const wallet = walletService.fromV3(w, '');
        expect(wallet.getAddressString()).toEqual('0xa9886ac7489ecbcbd79268a79ef00d940e5fe1f2')
    });
    */
    it('should work with (broken) mixed-case input files', () => {
        const w =
            '{"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"6087dab2f9fdbbfaddc31a909735c1e6"},"ciphertext":"5318b4d5bcd28de64ee5559e671353e16f075ecae9f99c7a79a38af5f869aa46","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"ae3cd4e7013836a3df6bd7241b12db061dbe2c6785853cce422d148a624ce0bd"},"mac":"517ead924a9d0dc3124507e3393d175ce3ff7c1e96529c6c555ce9e51205e9b2"},"id":"3198bc9c-6672-5ab3-d995-4942343ae5b6","version":3}';
        const wallet = walletService.fromV3(w, 'testpassword', true);
        expect(wallet.getAddressString()).toEqual('0x008aeeda4d805471df9b2a5b0f38a0c3bcba786b');
    });

    it("shouldn't work with (broken) mixed-case input files in strict mode", () => {
        const w =
            '{"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"6087dab2f9fdbbfaddc31a909735c1e6"},"ciphertext":"5318b4d5bcd28de64ee5559e671353e16f075ecae9f99c7a79a38af5f869aa46","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"ae3cd4e7013836a3df6bd7241b12db061dbe2c6785853cce422d148a624ce0bd"},"mac":"517ead924a9d0dc3124507e3393d175ce3ff7c1e96529c6c555ce9e51205e9b2"},"id":"3198bc9c-6672-5ab3-d995-4942343ae5b6","version":3}';
        expect(() => walletService.fromV3(w, 'testpassword')).toThrow(
            new Error("Cannot read property 'kdf' of undefined")
        );
    });

    it('should fail for wrong version', () => {
        const w = '{"version": 2}';
        expect(() => walletService.fromV3(w, 'testpassword')).toThrow(new Error('Not a V3 wallet'));
    });

    it('should fail for wrong kdf', () => {
        const w = '{"crypto":{"kdf":"superkey"},"version":3}';
        expect(() => walletService.fromV3(w, 'testpassword')).toThrow(new Error('Unsupported key derivation scheme'));
    });

    it('should fail for wrong prf in pbkdf2', () => {
        const w = '{"crypto":{"kdf":"pbkdf2","kdfparams":{"prf":"invalid"}},"version":3}';
        expect(() => walletService.fromV3(w, 'testpassword')).toThrow(new Error('Unsupported parameters to PBKDF2'));
    });
});
