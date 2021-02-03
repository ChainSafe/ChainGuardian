const mByte = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
const iByte = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

export const memoryNumberToString = (value: number, isI = false): string => {
    const thresh = isI ? 1000 : 1024;

    if (Math.abs(value) < thresh) {
        return value + " B";
    }

    const pw = Math.floor(Math.log(value) / Math.log(thresh));
    return Math.round((value / Math.pow(thresh, pw)) * 100) / 100 + " " + (isI ? iByte : mByte)[pw];
};

export const memoryStringToNumber = (value: string): number => {
    const i = iByte.find((v) => value.includes(v));
    const m = mByte.find((v) => value.includes(v));
    const thresh = i ? 1000 : 1024;
    const number = Number(value.replace(new RegExp(i || m, "g"), ""));

    if (isNaN(number)) return 0;
    const pw = i ? iByte.findIndex((v) => v === i) : mByte.findIndex((v) => v === m);

    return number * Math.pow(thresh, pw + 1);
};
