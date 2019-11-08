import { ethers, utils } from "ethers";
import { DEPOSIT_AMOUNT } from "./constants";
import { bool } from "@chainsafe/eth2.0-types";

export default async function checkUserDepositAmount(provider: ethers.providers.Web3Provider, pubkey: string): Promise<bool> {
    let filter = {
        fromBlock: 0
    }
    const logs = await provider.getLogs(filter)

    let amountSum = 0

    logs.forEach((log: any) => {
        const data = utils.defaultAbiCoder.decode(
            [ 'bytes', 'bytes', 'bytes', 'bytes', 'bytes' ],
            log.data
         );
    
         const validatorPubKey = data[0]
         if(validatorPubKey === pubkey){
            const amount = utils.formatUnits(changeEndianness(data[2]), "gwei")
            amountSum += parseFloat(amount)
         }
    })

     return amountSum >= parseFloat(DEPOSIT_AMOUNT)
}

// NOTE maybe fetch from some library
const changeEndianness = (value: string) => {
    value = value.split('0x')[1]
    const result = [];
    let len = value.length - 2;
    while (len >= 0) {
      result.push(value.substr(len, 2));
      len -= 2;
    }
    return '0x'+result.join('');
}
