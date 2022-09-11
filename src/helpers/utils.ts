import ntc from "../lib/ntc";

export function getColorName(colorCode) {
    const result = !!colorCode ? ntc.name(colorCode) : colorCode;
    if (result && result.length >= 2 && result[1]) {
        return String(result[1]).replace('Invalid Color:', '')
    } else {
        return colorCode
    }
}