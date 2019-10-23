import {Keypair, Keypair as KeyPair} from "@chainsafe/bls/lib/keypair";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import BN from "bn.js";
import {SigningKey} from "ethers/utils";
import {ethers} from "ethers";
import config from "../../../../src/renderer/services/deposit/options";

export function generateKeyPair(seed: number): KeyPair {
    return new Keypair(PrivateKey.fromBytes(new BN(seed).toArrayLike(Buffer, "le", 32)));
}

export async function deployDepositContract(testProvider: any, prKey: string): Promise<string> {
    const deployKey: SigningKey = new SigningKey(prKey);
    const deployWallet = new ethers.Wallet(deployKey, testProvider);
    const factory = new ethers.ContractFactory(
        config.depositContract.abi,
        config.depositContract.bytecode,
        deployWallet
    );
    const contract = await factory.deploy();
    // TODO call contract trough ethersjs Contract class
    // return await contract.deployed();
    await contract.deployed();
    return contract.address;
}