import {BlockAttestations} from "../../../../../src/renderer/services/eth2/client/interface";

export const mockBeaconBlockAttestations = (
    block: string,
    slot: number,
    index: number,
    missed: boolean,
    empty: boolean,
): BlockAttestations[] | null => {
    if (missed) return null;
    const blocks: BlockAttestations[] = [];

    const randomLength = Math.floor(Math.random() * 4);
    for (let i = 0; i <= randomLength; i++) {
        const randomIndex = Math.floor(Math.random() * 30);
        if (randomIndex === index) continue;
        blocks.push(createAttestations(slot - 1, randomIndex, block));
    }
    if (!empty) {
        blocks.push(createAttestations(slot - 1, index, block));
    }

    return blocks;
};

const createAttestations = (slot: number, index: number, beaconBlockRoot: string): BlockAttestations => ({
    aggregationBits: "0x" + createRandomBigNumber(41).toString(16),
    data: {
        slot,
        index,
        beaconBlockRoot,
        source,
        target,
    },
    signature: "0x" + createRandomBigNumber(231).toString(16),
});
const source = {
    epoch: 14591,
    root: "0xd0031a93c16cb0293ded16fc2fbe154577b81df0bae7f79b56b2fec70571d048",
};
const target = {
    epoch: 14592,
    root: "0xcc8507c2ac01efd5ac1c8c3a817a7a4ab30b05cb8415fe9b5222ded407eb35c4",
};
const createRandomBigNumber = (length: number): bigint => {
    let numberString = "";
    for (let i = 0; i <= length; i++) {
        numberString += String(Math.floor(Math.random() * 10));
    }
    return BigInt(numberString);
};
