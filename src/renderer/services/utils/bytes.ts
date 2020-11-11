export function base64Decode(data: string): Buffer {
    return Buffer.from(data, "base64");
}
export function base64Encode(data: Buffer): string {
    return data.toString("base64");
}
export function fromHex(data: string): Buffer {
    return Buffer.from(data.replace("0x", ""), "hex");
}
export function toHex(data: Buffer): string {
    return data.toString("hex");
}
