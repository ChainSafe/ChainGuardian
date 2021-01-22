export const truncatePublicKey = (key: string, prefix = 50, suffix = 8): string => {
    const start = key.substring(0, prefix);
    const end = key.substring(key.length - suffix, key.length);

    return `${start}. . .${end}`;
};

export const capitalize = (string: string): string => string.charAt(0).toUpperCase() + string.slice(1);
