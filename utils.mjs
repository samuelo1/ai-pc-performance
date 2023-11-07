export const getNumberFromText = (text) => {
    text = text.replace(/\s/g, "");
    text = text.replace(/,/g, "");
    return parseInt(text);
};

export const getFrequencyNums = (text) => {
    const [memClockFrequencyTextMax, memClockFrequencyTextMin] = text.split("(");
    return [
        getNumberFromText(memClockFrequencyTextMin),
        getNumberFromText(memClockFrequencyTextMax),
    ];
};

export const getModuleInfo = (text) => {
    const [memModSize, remainingMemModText] = text.split(" MB ");
    const [memModBrand, memModSpeed] = remainingMemModText.split(" @ ");
    return [memModSize, memModBrand, memModSpeed];
};