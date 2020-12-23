export async function collect<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result = [];
    for await (const item of source) {
        result.push(item);
    }
    return result;
}
