export const base64ToHex = (value: string): string => "0x" + Buffer.from(value, "base64").toString("hex");
export const hexToBase64 = (value: string): string => Buffer.from(value.substring(2), "hex").toString("base64");
export const stringToBase64 = (value: string): string => Buffer.from(value).toString("base64");
