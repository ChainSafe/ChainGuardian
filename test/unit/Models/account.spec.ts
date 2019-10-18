import { CGAccount } from '../../../src/renderer/models/account';
import { ICGKeystore, ICGKeystoreFactory } from '../../../src/renderer/services/interfaces';
import { Keypair } from '@chainsafe/bls/lib/keypair';
var fs = require('fs');
import sinon, { stub } from 'sinon';

// Passwords for keystores 1 & 2
const PRIMARY_KEYSTORE_PASSWORD = 'chainGuardianPass';

/*eslint-disable*/
const CGKeystoreTest: ICGKeystoreFactory = class CGKeystoreTest implements ICGKeystore {
    private file: string;
    constructor(file: string) {
        this.file = file;
    }

    decrypt(password: string): Keypair {
        if (password === PRIMARY_KEYSTORE_PASSWORD) {
            return Keypair.generate();
        } else {
            throw new Error('Incorrect password');
        }
    }

    getAddress(): string {
        return '';
    }
    // Methods bellow are not important for Account class
    changePassword(oldPassword: string, newPassword: string): void {
        throw new Error('Method not implemented.');
    }
    destroy(): void {
        throw new Error('Method not implemented.');
    }
    create(file: string, password: string, keypair: Keypair): ICGKeystore {
        throw new Error('Method not implemented.');
    }
};
/*eslint-enable*/

function createTestAccount(): CGAccount {
    return new CGAccount({ name: 'Test Account', directory: './test_keystores/', sendStats: false }, CGKeystoreTest);
}

describe('CGAccount tests', () => {
    let sandbox: sinon.SinonSandbox;
    let fsStub: sinon.SinonStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox
            .stub(fs, 'readdirSync')
            .withArgs('./test_keystores/')
            .returns(['keystore1.json', 'keystore2.json', 'keystoreNotJSON']);
    });

    afterEach(() => {
        sandbox.restore();
    });
    it('should be able to get validator addresses from keystores', () => {
        const account = createTestAccount();
        const validatorsAddresses = account.getValidatorsAddresses();

        expect(validatorsAddresses.length).toEqual(2);
    });

    it('should be able to get validator keypairs if the account is unlocked', () => {
        const account = createTestAccount();

        account.unlock(PRIMARY_KEYSTORE_PASSWORD);
        const validatorKeypairs = account.getValidators(PRIMARY_KEYSTORE_PASSWORD);

        expect(validatorKeypairs.length).toEqual(2);

        account.lock();

        expect(() => {
            account.getValidators(PRIMARY_KEYSTORE_PASSWORD);
        }).toThrowError();
    });

    it('should not be able to get validator keypairs if the account is locked', () => {
        const account = createTestAccount();

        expect(() => {
            account.getValidators(PRIMARY_KEYSTORE_PASSWORD);
        }).toThrowError();
    });

    it('should be able to lock account', () => {
        const account = createTestAccount();

        account.unlock(PRIMARY_KEYSTORE_PASSWORD);
        account.lock();
        expect(() => {
            account.getValidators(PRIMARY_KEYSTORE_PASSWORD);
        }).toThrowError();
    });

    it('should not be able to unlock with wrong password', () => {
        const account = createTestAccount();

        account.unlock('wrongPassword');

        expect(() => {
            account.getValidators('wrongPassword');
        }).toThrowError();
    });

    it('should be able to verify correct password', () => {
        const account = createTestAccount();

        expect(account.isCorrectPassword(PRIMARY_KEYSTORE_PASSWORD)).toEqual(true);
        expect(account.isCorrectPassword('wrongPassword')).toEqual(false);
    });
});
