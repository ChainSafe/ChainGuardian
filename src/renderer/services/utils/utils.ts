/**
 * Partitions provided array on two arrays based on provided predicate.
 * @param array
 * @param predicate
 */
export function partition<T>(array: Array<T>, predicate: (arg: T) => boolean): [Array<T>, Array<T>] {
    return array.reduce(([pass, fail]: [Array<T>, Array<T>], elem) => {
        return predicate(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    }, [[], []]);
}

/**
 * Joins array of strings in oxford style of ordering.
 * @param array of string values
 * @param separator that is used link ordering items
 * @param lastSeparator that is used to link last ordering item
 */
export function joinArrayOxfStyle(array: string[], separator: string, lastSeparator: string): string {
    if (array.length === 1) return array[0];
    else return `${array.slice(0, -1).join(`${separator} `)} ${lastSeparator} ${array.slice(-1)}`;
}