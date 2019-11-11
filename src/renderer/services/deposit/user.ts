import { ethers, utils, Contract } from "ethers";
import { DEPOSIT_AMOUNT } from "./constants";
import { bool } from "@chainsafe/eth2.0-types";
import DepositContract from './options'
import { Keypair } from "@chainsafe/bls/lib/keypair";

const PUBKEY_INDEX = 0
const DATA_INDEX = 2

export function depositEventListener(
    provider: ethers.providers.Web3Provider,
    depositContractAddress: string,
    callback: any
): void {
    const filter = {
        address: depositContractAddress
    }

    provider.on(filter, (result) => {
        callback(result)
    })
}

export function waitForEventWithTimeout(
    provider: ethers.providers.Web3Provider,
    depositContractAddress: string,
    signingKey: Keypair,
    timeout: number
): Promise<any> {
    return new Promise((resolve, reject) => {

        const contract = new Contract(depositContractAddress, DepositContract.abi, provider)
        let filter = contract.filters.DepositEvent(null);

        console.log(signingKey.publicKey.toHexString())

        // Listen for our filtered results
        contract.on(filter, (pubkey, withdrawalCredentials, amount, signature, index) => {
            console.log('I received ' + utils.formatUnits(changeEndianness(amount), "gwei") + ' tokens from ' + pubkey);
            clearTimeout(timer);
            resolve(index);
        });

        let timer: any;
        /*
        const filter = {
            address: depositContractAddress
        }

        provider.on(filter, (result) => {
            clearTimeout(timer);
            resolve(result);
        })
        */
        timer = setTimeout(() => {
            reject(new Error("Timeout waiting for deposit event"));
        }, timeout);
    });
}


export async function checkUserDepositAmount(
    provider: ethers.providers.Web3Provider,
    depositContractAddress: string,
    signingKey: Keypair): Promise<bool> {
    const filter = {
        fromBlock: 0,
        address: depositContractAddress
    }
    const logs = await provider.getLogs(filter)
    let amountSum = 0

    logs.forEach((log: any) => {
        const data = utils.defaultAbiCoder.decode(
            DepositContract.abi[0].inputs.map((parameter: any) => parameter.type),
            log.data
        );

        const validatorPubKey = data[PUBKEY_INDEX]

        if (validatorPubKey === signingKey.publicKey.toHexString()) {
            const amount = utils.formatUnits(changeEndianness(data[DATA_INDEX]), "gwei")
            amountSum += parseFloat(amount)
        }
    })

    return amountSum >= parseFloat(DEPOSIT_AMOUNT)
}

// NOTE maybe use code from some library
const changeEndianness = (value: string) => {
    value = value.split('0x')[1]
    const result = [];
    let len = value.length - 2;
    while (len >= 0) {
        result.push(value.substr(len, 2));
        len -= 2;
    }
    return '0x' + result.join('');
}
