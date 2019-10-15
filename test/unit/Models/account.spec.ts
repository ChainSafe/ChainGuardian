import { CGAccount } from "../../../src/renderer/models/account"
import { readdirSync } from "fs";

function createTestAccount(): CGAccount {
  return new CGAccount('Test Account', './test/test_keystores/', false);
}

// Passwords for keystores 1 & 2
const PRIMARY_KEYSTORE_PASSWORD   = "chainGuardianPass";
// Password for keystore 3
const SECONDARY_KEYSTORE_PASSWORD = "chainGuardianDiffPass";

describe('CGAccount tests', () => {
  it('should be able to get validator addresses from keystores', () => {
    let account = createTestAccount();
    const validatorsAddresses = account.getValidatorsAddresses();

    expect(validatorsAddresses.length).toEqual(3);
  })

  it('should be able to get validator keypairs if the account is unlocked', () => {
    let account = createTestAccount();

    account.unlock(PRIMARY_KEYSTORE_PASSWORD);
    let validatorKeypairs = account.getValidators(PRIMARY_KEYSTORE_PASSWORD);

    expect(validatorKeypairs.length).toEqual(2);

    account.lock();

    expect(() => {account.getValidators(PRIMARY_KEYSTORE_PASSWORD)}).toThrowError();
  })

  it('should not be able to get validator keypairs if the account is locked', () => {
    let account = createTestAccount();

    expect(() => {account.getValidators(PRIMARY_KEYSTORE_PASSWORD)}).toThrowError();
  })

  it('should be able to lock account', () => {
    let account = createTestAccount();

    account.unlock(PRIMARY_KEYSTORE_PASSWORD);
    account.lock();

    expect(() => {account.getValidators(PRIMARY_KEYSTORE_PASSWORD)}).toThrowError();
  })

  it('should not be able to unlock with wrong password', () => {
    let account = createTestAccount();

    account.unlock('wrongPassword');

    expect(() => {account.getValidators('wrongPassword')}).toThrowError();
  })

  it('should be able to verify correct password', () => {
    let account = createTestAccount();

    expect(account.isCorrectPassword(PRIMARY_KEYSTORE_PASSWORD)).toEqual(true);
    expect(account.isCorrectPassword(SECONDARY_KEYSTORE_PASSWORD)).toEqual(true);
    expect(account.isCorrectPassword('wrongPassword')).toEqual(false);
  })
})