import { Builder, By, until } from "selenium-webdriver";
import fs from "fs";
// const options = new Options();
// const driver = await new Builder().forBrowser('chrome').setChromeOptions(options.addArguments('--headless=new')).build();
const FETCH_COUNT = 100;

const driver = await new Builder().forBrowser("chrome").build();

var stream = fs.createWriteStream("training-data.csv");
stream.once("open", async function (fd) {
  const fields = Object.keys(json[0]);

  stream.write(fields.join(","));
  stream.write("\n");

  for (let i = 0; i < FETCH_COUNT; i++) {
    const randomEightDigitNum = Math.floor(Math.random() * 10 ** 8);
    console.log("Fetching ", randomEightDigitNum);
    await driver.get("https://www.3dmark.com/spy/" + randomEightDigitNum);
    const page = {};

    const getLoadedElement = async (selector) => {
      const element = driver.findElement(By.css(selector));
      await driver.wait(
        until.elementTextMatches(element, new RegExp(".+")),
        10000
      );
      return await element;
    };

    const getNumberFromText = (text) => {
      text = text.replace(/\s/g, "");
      text = text.replace(/,/g, "");
      return parseInt(text);
    };

    const getFrequencyNums = (text) => {
      const [memClockFrequencyTextMax, memClockFrequencyTextMin] =
        text.split("(");
      return [
        getNumberFromText(memClockFrequencyTextMin),
        getNumberFromText(memClockFrequencyTextMax),
      ];
    };

    const scoreElement = await getLoadedElement(
      "#body > div.container > div.result-header.clearfix.mb0.hidden > div.result-header-details.column3-2 > div.result-header-details-header.clearfix > h1 > span:nth-child(2)"
    );
    const scoreText = await scoreElement.getText();
    page.score = getNumberFromText(scoreText);

    const graphicsCardElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(2) > a"
    );
    page.graphicsCard = await graphicsCardElement.getText();

    const numCardsElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(6)"
    );
    const numCardsText = await numCardsElement.getText();
    page.numCards = getNumberFromText(numCardsText);

    const crossFireElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(8)"
    );
    const crossFireText = await crossFireElement.getText();
    page.crossFire = crossFireText.toLowerCase() === "on";

    const gpuMemory = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(10)"
    );
    page.gpuMemory = await gpuMemory.getText();

    const gpuClockSpeedElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(12)"
    );
    const gpuClockSpeedText = await gpuClockSpeedElement.getText();
    [page.gpuClockSpeedMin, page.gpuClockSpeedMax] =
      getFrequencyNums(gpuClockSpeedText);

    const avgGpuClockFrequencyElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(14)"
    );
    const avgGpuClockFrequencyText =
      await avgGpuClockFrequencyElement.getText();
    page.avgGpuClockFrequency = getNumberFromText(avgGpuClockFrequencyText);

    const memClockFrequencyElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(16)"
    );
    const memClockFrequencyText = await memClockFrequencyElement.getText();
    [page.memClockFrequencyMin, page.memClockFrequencyMax] = getFrequencyNums(
      memClockFrequencyText
    );

    const avgMemClockFrequencyElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(18)"
    );
    const avgMemClockFrequencyText =
      await avgMemClockFrequencyElement.getText();
    page.avgMemClockFrequency = getNumberFromText(avgMemClockFrequencyText);

    const avgTempElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(20)"
    );
    const avgTempText = await avgTempElement.getText();
    page.avgTemp = getNumberFromText(avgTempText);

    const driverVersionElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(22)"
    );
    page.driverVersion = await driverVersionElement.getText();

    const driverStatus = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(24)"
    );
    page.driverStatus = await driverStatus.getText(); // TODO investigate what options are available here

    const eccMemory = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl > dd:nth-child(26)"
    );
    page.eccMemory = await eccMemory.getText(); // TODO investigate what options are available here

    const processorName = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl > dd:nth-child(2)"
    );
    page.processorName = await processorName.getText();

    const cpuClockFrequency = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl > dd:nth-child(4)"
    );
    page.cpuClockFrequency = await cpuClockFrequency.getText();
    [page.cpuClockFrequencyMin, page.cpuClockFrequencyMax] = getFrequencyNums(
      page.cpuClockFrequency
    );

    const avgClockFreqency = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl > dd:nth-child(6)"
    );
    page.avgClockFreqency = await avgClockFreqency.getText();
    page.avgClockFreqency = getNumberFromText(page.avgClockFreqency);

    const cpuTemp = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl > dd:nth-child(8)"
    );
    page.cpuTemp = await cpuTemp.getText();
    page.cpuTemp = getNumberFromText(page.cpuTemp);

    const physicalLogicalProcessorsElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl > dd:nth-child(10)"
    );
    const physicalLogicalProcessorsText =
      await physicalLogicalProcessorsElement.getText();
    const [physicalProcessors, logicalProcessors] =
      physicalLogicalProcessorsText.split("/");
    page.physicalProcessors = getNumberFromText(physicalProcessors);
    page.logicalProcessors = getNumberFromText(logicalProcessors);

    const coreCountElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl > dd:nth-child(12)"
    );
    const coreCountText = await coreCountElement.getText();
    page.coreCount = getNumberFromText(coreCountText);

    const packageElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl > dd:nth-child(14)"
    );
    page.package = await packageElement.getText();

    const manufacturingProcessElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl > dd:nth-child(16)"
    );
    const manufacturingProcessText =
      await manufacturingProcessElement.getText();
    page.manufacturingProcess = getNumberFromText(manufacturingProcessText);

    const tdpElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl > dd:nth-child(18)"
    );
    const tdpText = await tdpElement.getText();
    page.tdp = getNumberFromText(tdpText);

    const osElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(5) > dl > dd:nth-child(2)"
    );
    let osText = await osElement.getText();
    osText = osText.split(" (");
    page.os = osText[0];

    const motherboardModelElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(5) > dl > dd:nth-child(4)"
    );
    page.motherboardModel = await motherboardModelElement.getText();

    const memoryElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(5) > dl > dd:nth-child(6)"
    );
    const memoryText = await memoryElement.getText();
    page.memory = getNumberFromText(memoryText);

    const getModuleInfo = (text) => {
      const [memModSize, remainingMemModText] = text.split(" MB ");
      const [memModBrand, memModSpeed] = remainingMemModText.split(" @ ");
      return [memModSize, memModBrand, memModSpeed];
    };
    const memoryModule1Element = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(5) > dl > dd:nth-child(8)"
    );
    const memoryModule1Text = await memoryModule1Element.getText();
    [page.memMod1Size, page.memMod1Brand, page.memMod1Speed] =
      getModuleInfo(memoryModule1Text);

    const memoryModule2Element = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(5) > dl > dd:nth-child(10)"
    );
    const memoryModule2Text = await memoryModule2Element.getText();
    [page.memMod2Size, page.memMod2Brand, page.memMod2Speed] =
      getModuleInfo(memoryModule2Text);

    const hardDriveElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(5) > dl > dd:nth-child(12)"
    );
    const hardDriveText = await hardDriveElement.getText();
    const [hardDriveSizeText, hardDriveModelText] = hardDriveText.split(" GB ");
    page.hardDriveSize = getNumberFromText(hardDriveSizeText);
    page.hardDriveModel = hardDriveModelText;

    const vbsStatusElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(5) > dl > dd:nth-child(14)"
    );
    page.vbsStatus = await vbsStatusElement.getText();

    const hvciStatusElement = await getLoadedElement(
      "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(5) > dl > dd:nth-child(16)"
    );
    page.hvciStatus = await hvciStatusElement.getText();

    driver.close();

    console.log("page:", page);

    let row = fields.map((field) => page[field]);
    stream.write(row.join(","));
    stream.write("\n");
  }

  stream.end();
  driver.close();
});
