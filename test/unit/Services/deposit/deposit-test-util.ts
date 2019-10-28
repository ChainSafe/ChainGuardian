import {ethers} from "ethers";
import DepositContract from "../../../../src/renderer/services/deposit/options";
import {SigningKey} from "ethers/utils";

export async function deployDepositContract(testProvider: any, prKey: string): Promise<string> {
    const deployKey: SigningKey = new SigningKey(prKey);
    const deployWallet = new ethers.Wallet(deployKey, testProvider);
    const factory = new ethers.ContractFactory(
        DepositContract.abi,
        DepositContract.bytecode,
        deployWallet
    );
    const contract = await factory.deploy();
    await contract.deployed();
    return contract.address;
}