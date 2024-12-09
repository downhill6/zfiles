export function byteToSize(byte: number) {
    if (byte === 0) return "0 B";
    const k = 1000;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(byte) / Math.log(k));
    return (byte / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}
