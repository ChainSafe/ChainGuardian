import { Keypair } from '@chainsafe/bls/lib/keypair';
import { readdirSync, readFileSync } from 'fs';

class CGAccount {
  public name: string;
  public directory: string;
  public sendStats: boolean;


  constructor(name: string, directory: string, sendStats:boolean = false){
    this.name = name;
    this.directory = directory;
    this.sendStats = sendStats;
  }

  /**
   * should return addresses from validator keystores in account directory
   */
  getValidatorsAddresses(): string[] {
    // Loop trough files in account directory
    // TODO: Filter only json files
    const keystoreFiles: string[] = readdirSync(this.directory);
    let validatorAddresses: string[] = [];
    keystoreFiles.forEach((file) => {
      const fileContents = readFileSync(file);
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
    return [];
  }

  /**
   * Check if password is valid
   * @param password decryption password of the keystore
   */
  isCorrectPassword(password: string): boolean {
    // ? Multiple keystore files?
    return false;
  }

  /**
   * should try to decrypt keystores using given password,
   * throw exception if wrong password (save unlocked keypairs into private field)
   * @param password decryption password of the keystore
   */
  unlock(password: string): void {
    return;
  }

  /**
   * delete all unlocked keypairs from object
   */
  lock(): void {
    return;
  }
}