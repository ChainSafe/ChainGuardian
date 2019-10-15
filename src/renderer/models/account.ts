import { Keypair } from '@chainsafe/bls/lib/keypair';
import { readdirSync, readFileSync } from 'fs';
import { PrivateKey } from '@chainsafe/bls/lib/privateKey';
const eth1Wallet = require('ethereumjs-wallet');

export class CGAccount {
  public name: string;
  public directory: string;
  public sendStats: boolean;

  private unlocked: boolean  = false;
  private validators: Keypair[] = [];


  constructor(name: string, directory: string, sendStats:boolean = false){
    this.name = name;
    // Add / to the end if not provided
    this.directory = directory + (directory.endsWith('/') ? '' : '/');
    this.sendStats = sendStats;
  }

  /**
   * should return addresses from validator keystores in account directory
   */
  getValidatorsAddresses(): string[] {
    // Loop trough files in account directory
    // TODO: Filter only json files
    let keystoreFiles: string[] = this.getKeystoreFiles();
    
     
    let validatorAddresses: string[] = [];
    keystoreFiles.forEach((file) => {
      if(! file.toLowerCase().endsWith('.json')){
        // Skip any files that are not in json format
        return; 
      }
      const fileContents = readFileSync(this.directory + file);
      const fileJSON = JSON.parse(fileContents.toString());
      if(fileJSON.address){
        validatorAddresses.push(fileJSON.address);
      }
    })
    return validatorAddresses;
  }

  /**
   * returns all validator keypairs or throws if not unlocked
   * @param password decryption password of the keystore
   */
  getValidators(password: string): Keypair[] {
    // TODO: loop trough keystore files and unlock them
    if(! this.unlocked){
      throw new Error("Keystore locked.");
    }
    return this.validators;
  }

  /**
   * Check if password is valid
   * @param password decryption password of the keystore
   */
  isCorrectPassword(password: string): boolean {
    /**
     * ? As there can be multiple keystore files there can also be
     * ? different passwords that these keystores use, we need to
     * ? define how are we going to handle these situations.
     * * Currently, if any of the keystores matches the provided
     * * password this method returns true.
     */
    
    let keystoreFiles = this.getKeystoreFiles();

    for(let fileIdx in keystoreFiles){
      const file = keystoreFiles[fileIdx];
      const filePath = this.directory + file;
      const fileContents = readFileSync(filePath);
      const fileContentsJSON = JSON.parse(fileContents.toString());

      try{
        eth1Wallet.fromV3(fileContentsJSON, password);
      } catch(e) {
        continue;
      }
      return true;
    }
    return false;
  }

  /**
   * should try to decrypt keystores using given password,
   * throw exception if wrong password (save unlocked keypairs into private field)
   * @param password decryption password of the keystore
   */
  unlock(password: string): void {
    let keystoreFiles = this.getKeystoreFiles();

    keystoreFiles.forEach((file) => {
      const filePath = this.directory + file;
      const fileContents = readFileSync(filePath);
      const fileContentsJSON = JSON.parse(fileContents.toString());
      
      let unlockedKeystore;
      try{
        unlockedKeystore = eth1Wallet.fromV3(fileContentsJSON, password);
        const privateKey = PrivateKey.fromBytes(unlockedKeystore._privKey);
        const keypair = new Keypair(privateKey);

        this.validators.push(keypair);
        this.unlocked = true;
      } catch(e){
        // Failed to unlock keystore, probably wrong password
        // Skip this keystore
        return;
      }
    })
  }

  /**
   * delete all unlocked keypairs from object
   */
  lock(): void {
    // Clear validator Keypairs
    this.validators = [];
    this.unlocked = false;
  }

  private getKeystoreFiles(): string[]{
    let keystores: string[] = [];
    try{
      keystores = readdirSync(this.directory);
    } catch(e) {
      return [];
    }
    return keystores;
  }
}