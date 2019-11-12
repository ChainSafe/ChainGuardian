export function getRandomInt (n: number): number {
    return Math.floor(Math.random() * Math.floor(n));
}
export function getRandomIntArray (n: number): Array<number> {
    const array: Array<number> = [3];
    let randInt = 0;
    for (let i = 0; i < 3; i++) {
        do{
            randInt = getRandomInt(n);
        } while (array.includes(randInt));
        array[i]=randInt;
    }
    return array;
}