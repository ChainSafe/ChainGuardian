import { CGAccount } from "../../../src/renderer/models/account";
import {
  ICGKeystore,
  ICGKeystoreFactory
} from "../../../src/renderer/services/interfaces";
import { Keypair } from "@chainsafe/bls/lib/keypair";
var fs = require("fs");
import sinon from "sinon";
import { Eth1ICGKeystoreFactory } from "../../../src/renderer/services/Eth1ICGKeystore";

// Passwords for keystores 1 & 2
const PRIMARY_KEYSTORE_PASSWORD = "chainGuardianPass";

const mockKeystore = {
  version: 3,
  id: "6ea112aa-4f1c-4135-a061-ee4c55be0e92",
  address: "c840359492685ceb239b34742100d343e1eaa66c",
  crypto: {
    ciphertext:
      "232b269cf14de72399be10640bfeb6abf90844d6e0234635195d65b293acf457",
    cipherparams: { iv: "497c566a8ce0d22f9f0a62dc7db7f327" },
    cipher: "aes-128-ctr",
    kdf: "scrypt",
    kdfparams: {
      dklen: 32,
      salt: "2679d31db8b7be7cd8f9c59fbe9e4df8a1c3d9268a001782c4ba1798ee0fb916",
      n: 131072,
      r: 8,
      p: 1
    },
    mac: "6f28f837c69cdc89b87a1b696d92b38e6bc60fa5b4ac166d65871afdabb2e6bb"
  }
};

function createTestAccount(): CGAccount {
  return new CGAccount({
    name: "Test Account",
    directory: "./test_keystores/",
    sendStats: false
  });
}

describe("CGAccount tests", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox
      .stub(fs, "readdirSync")
      .withArgs("./test_keystores/")
      .returns(["keystore1.json", "keystore2.json", "keystoreNotJSONError"]);

    sandbox
      .stub(fs, "existsSync")
      .withArgs("./test_keystores/keystore1.json")
      .returns(true)
      .withArgs("./test_keystores/keystore2.json")
      .returns(true);
    sandbox
      .stub(fs, "readFileSync")
      .withArgs("./test_keystores/keystore1.json")
      .returns(JSON.stringify(mockKeystore))
      .withArgs("./test_keystores/keystore2.json")
      .returns(JSON.stringify(mockKeystore));

    sandbox.stub(Eth1ICGKeystoreFactory.prototype, "getAddress").returns("");
    sandbox
      .stub(Eth1ICGKeystoreFactory.prototype, "decrypt")
      .callsFake(password => {
        if (password === PRIMARY_KEYSTORE_PASSWORD) {
          return Keypair.generate();
        } else {
          throw new Error("Incorrect password");
        }
      });
  });

  afterEach(() => {
    sandbox.restore();
  });
  it("should be able to get validator addresses from keystores", () => {
    const account = createTestAccount();
    const validatorsAddresses = account.getValidatorsAddresses();

    expect(validatorsAddresses.length).toEqual(2);
  });

  it("should be able to get validator keypairs if the account is unlocked", () => {
    const account = createTestAccount();

    account.unlock(PRIMARY_KEYSTORE_PASSWORD);
    const validatorKeypairs = account.getValidators(PRIMARY_KEYSTORE_PASSWORD);

    expect(validatorKeypairs.length).toEqual(2);

    account.lock();

    expect(() => {
      account.getValidators(PRIMARY_KEYSTORE_PASSWORD);
    }).toThrowError();
  });

  it("should not be able to get validator keypairs if the account is locked", () => {
    const account = createTestAccount();

    expect(() => {
      account.getValidators(PRIMARY_KEYSTORE_PASSWORD);
    }).toThrowError();
  });

  it("should be able to lock account", () => {
    const account = createTestAccount();

    account.unlock(PRIMARY_KEYSTORE_PASSWORD);
    account.lock();
    expect(() => {
      account.getValidators(PRIMARY_KEYSTORE_PASSWORD);
    }).toThrowError();
  });

  it("should not be able to unlock with wrong password", () => {
    const account = createTestAccount();

    account.unlock("wrongPassword");

    expect(() => {
      account.getValidators("wrongPassword");
    }).toThrowError();
  });

  it("should be able to verify correct password", () => {
    const account = createTestAccount();

    expect(account.isCorrectPassword(PRIMARY_KEYSTORE_PASSWORD)).toEqual(true);
    expect(account.isCorrectPassword("wrongPassword")).toEqual(false);
  });
});
