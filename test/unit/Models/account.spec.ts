import { CGAccount } from '../../../src/renderer/models/account';
import { readdirSync } from 'fs';
import { ICGKeystore, ICGType, ICGKeystoreFactory } from '../../../src/renderer/services/interfaces';
import { thisExpression } from '@babel/types';
import { Keypair } from '@chainsafe/bls/lib/keypair';

// Passwords for keystores 1 & 2
const PRIMARY_KEYSTORE_PASSWORD = 'chainGuardianPass';

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

function createTestAccount(): CGAccount {
    return new CGAccount('Test Account', './test/test_keystores/', false, CGKeystoreTest);
}

describe('CGAccount tests', () => {
    it('should be able to get validator addresses from keystores', () => {
        let account = createTestAccount();
        const validatorsAddresses = account.getValidatorsAddresses();

        expect(validatorsAddresses.length).toEqual(2);
    });

    it('should be able to get validator keypairs if the account is unlocked', () => {
        let account = createTestAccount();

        account.unlock(PRIMARY_KEYSTORE_PASSWORD);
        let validatorKeypairs = account.getValidators(PRIMARY_KEYSTORE_PASSWORD);

        expect(validatorKeypairs.length).toEqual(2);

        account.lock();

        expect(() => {
            account.getValidators(PRIMARY_KEYSTORE_PASSWORD);
        }).toThrowError();
    });

    it('should not be able to get validator keypairs if the account is locked', () => {
        let account = createTestAccount();

        expect(() => {
            account.getValidators(PRIMARY_KEYSTORE_PASSWORD);
        }).toThrowError();
    });

    it('should be able to lock account', () => {
        let account = createTestAccount();

        account.unlock(PRIMARY_KEYSTORE_PASSWORD);
        account.lock();
        expect(() => {
            account.getValidators(PRIMARY_KEYSTORE_PASSWORD);
        }).toThrowError();
    });

    it('should not be able to unlock with wrong password', () => {
        let account = createTestAccount();

        account.unlock('wrongPassword');

        expect(() => {
            account.getValidators('wrongPassword');
        }).toThrowError();
    });

    it('should be able to verify correct password', () => {
        let account = createTestAccount();

        expect(account.isCorrectPassword(PRIMARY_KEYSTORE_PASSWORD)).toEqual(true);
        expect(account.isCorrectPassword('wrongPassword')).toEqual(false);
    });
});
