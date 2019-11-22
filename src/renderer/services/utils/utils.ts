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