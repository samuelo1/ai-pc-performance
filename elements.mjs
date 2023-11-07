import { getModuleInfo, getNumberFromText, getFrequencyNums } from "./utils.mjs";
const page = {};

export async function getFieldValue(title, element) {
    title = title.toLowerCase().trim();
    const elementText = await element.getText();
    switch (title) {

        case "graphics card":
        case "memory":
        case "driver version":
        case "driver status":
        case "ecc video memory":
        case "package":
        case "processor":
        case "motherboard":
        case "vbs status":
        case "hvci status":
            return elementText;

        case "sli / crossfire":
            return elementText.toLowerCase() === "on";

        case "clock frequency":
        case "memory clock frequency":
            return getFrequencyNums(elementText);

        case "pyhsical / logical processors":
            const [physicalProcessors, logicalProcessors] =
                elementText.split("/");
            return [getNumberFromText(physicalProcessors), getNumberFromText(logicalProcessors)];

        case "operating system":
            return elementText.split(" (")[0];

        case "module 1":
        case "module 2":
            return getModuleInfo(elementText);

        case "hard drive model":
            const [hardDriveSizeText, hardDriveModelText] = elementText.split(" GB ");
            return [getNumberFromText(hardDriveSizeText), hardDriveModelText];
        
        default:
            return getNumberFromText(elementText);
    }
    // // const scoreElement = await getLoadedElement(
    //     "#body > div.container > div.result-header.clearfix.mb0.hidden > div.result-header-details.column3-2 > div.result-header-details-header.clearfix > h1 > span:nth-child(2)"
    // );

    // // const graphicsCardElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(2) > a"
    // );

    // // const numCardsElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(6)"
    // );


    // // const crossFireElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(8)"
    // );

    // // const gpuMemory = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(10)"
    // );

    // // const gpuClockSpeedElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(12)"
    // );


    // // const avgGpuClockFrequencyElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(14)"
    // );


    // // const memClockFrequencyElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(16)"
    // );

    // // const avgMemClockFrequencyElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(18)"
    // );


    // // const avgTempElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(20)"
    // );


    // // const driverVersionElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(22)"
    // );

    // // const driverStatus = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(24)"
    // );

    // // const eccMemory = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(26)"
    // );

    // // const processorName = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl > dd:nth-child(2)"
    // );

    // // const cpuClockFrequency = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl > dd:nth-child(4)"
    // );

    // // const avgClockFreqency = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl > dd:nth-child(6)"
    // );


    // // const cpuTemp = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl > dd:nth-child(8)"
    // );

    // // const physicalLogicalProcessorsElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl > dd:nth-child(10)"
    // );


    // // const coreCountElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl > dd:nth-child(12)"
    // );


    // // const packageElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl > dd:nth-child(14)"
    // );

    // // const manufacturingProcessElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl > dd:nth-child(16)"
    // );


    // // const tdpElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl > dd:nth-child(18)"
    // );

    // // const osElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(5) > dl > dd:nth-child(2)"
    // );


    // // const motherboardModelElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(5) > dl > dd:nth-child(4)"
    // );

    // // const memoryElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(5) > dl > dd:nth-child(6)"
    // );


    // // const memoryModule1Element = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(5) > dl > dd:nth-child(8)"
    // );


    // // const memoryModule2Element = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(5) > dl > dd:nth-child(10)"
    // );

    // // const hardDriveElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(5) > dl > dd:nth-child(12)"
    // );


    // // const vbsStatusElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(5) > dl > dd:nth-child(14)"
    // );

    // // const hvciStatusElement = await getLoadedElement(
    //     "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(5) > dl > dd:nth-child(16)"
    // );


}