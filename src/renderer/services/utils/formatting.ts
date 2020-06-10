export const truncatePublicKey = (key: string, prefix = 60, suffix = 8): string => {
    const start = key.substring(0, prefix);
    const end = key.substring(key.length - suffix, key.length);

    return `${start}. . .${end}`;
};
