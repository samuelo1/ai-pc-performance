import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { getFieldValue } from "./elements.mjs";
import { getNumberFromText } from "./utils.mjs";
import fs from "fs";
// const options = new Options();
// const driver = await new Builder().forBrowser('chrome').setChromeOptions(options.addArguments('--headless=new')).build();
const FETCH_COUNT = 10;

const options = new chrome.Options();
options.addArguments("--headless");
const driver = await new Builder()
  .forBrowser("chrome")
  .setChromeOptions(options)
  .build(options);

const fields = [
  "3dmark id",
  "graphics card",
  "# of cards",
  "sli / crossfire",
  "gpu memory",
  "general memory",
  "driver version",
  "driver status",
  "ecc video memory",
  "package",
  "processor",
  "motherboard",
  "vbs status",
  "hvci status",
  "gpu average temperature",
  "cpu average temperature",
  "gpu average clock frequency",
  "cpu average clock frequency",
  "gpu average memory clock frequency",
  "gpu clock frequency min",
  "gpu clock frequency max",
  "cpu clock frequency min",
  "cpu clock frequency max",
  "gpu memory clock frequency min",
  "gpu memory clock frequency max",
  "cpu physical processors",
  "cpu logical processors",
  "# of cores",
  "manufacturing process",
  "tdp",
  "operating system",
  "general module 1 size",
  "general module 1 brand",
  "general module 1 speed",
  "general module 2 size",
  "general module 2 brand",
  "general module 2 speed",
  "general hard drive model",
  "general hard drive model size",
  "score",
];

export const getLoadedElement = async (selector) => {
  try {
    let element = await driver.findElements(By.css(selector));
    if (element.length === 0) {
      return { getText: () => "" };
    }
    element = element[0];
    await driver.wait(
      until.elementTextMatches(element, new RegExp(".+")),
      10000
    );
    return element;
  } catch (e) {
    return { getText: () => "" };
  }
};

const now = new Date();
var nowAsString =
  now.getMonth() +
  "-" +
  now.getDate() +
  "-" +
  now.getFullYear() +
  "_" +
  now.getHours() +
  "-" +
  now.getMinutes() +
  "-" +
  now.getSeconds();

var stream = fs.createWriteStream(`training-data-${nowAsString}.csv`);
var errstream = fs.createWriteStream(`training-errors-${nowAsString}.csv`);

process.on("SIGINT", () => {
  stream.end();
  driver.close();
});

// errstream.once("open", async function (fd) {
// this is a race condition but it should pretty much always work and I don't feel like figuring out why it's not
stream.once("open", async function (fd) {
  let isFirstRun = true;
  while (true) {
    let hasErrorElement = true;
    let randomEightDigitNum;
    try {
      do {
        randomEightDigitNum = Math.floor((Math.random() / 2) * 10 ** 8);
        await driver.get("https://www.3dmark.com/spy/" + randomEightDigitNum);
        //   await new Promise((resolve) => setTimeout(resolve, 5000));

        //   errorElement = await getLoadedElement(
        //     "#body > div.container > div > div.column3-2.maincontent > div > div > div.error"
        //   );
        let errorElement = await driver.findElements(
          By.css(
            "#body > div.container > div > div.column3-2.maincontent > div > div > div.error"
          )
        );
        hasErrorElement = errorElement.length;
      } while (hasErrorElement);
      const page = {};

      const setPageValues = (section, field, value) => {
        field = field.toLowerCase().trim();
        switch (field) {
          case "average temperature":
          case "average memory clock frequency":
          case "average clock frequency":
          case "memory":
            page[section + " " + field] = value;
            break;

          case "clock frequency":
          case "memory clock frequency":
            [
              page[section + " " + field + " min"],
              page[section + " " + field + " max"],
            ] = value;
            break;

          case "physical / logical processors":
            [
              page[section + " physical processors"],
              page[section + " logical processors"],
            ] = value;
            break;

          case "module 1":
          case "module 2":
            [
              page[section + " " + field + " size"],
              page[section + " " + field + " brand"],
              page[section + " " + field + " speed"],
            ] = value;
            break;

          case "hard drive model":
            [
              page[section + " " + field + " size"],
              page[section + " " + field],
            ] = value;

          default:
            page[field] = value;
            break;
        }
      };

      page["3dmark id"] = randomEightDigitNum;

      const scoreElement = await getLoadedElement(
        "#body > div.container > div.result-header.clearfix.mb0.hidden > div.result-header-details.column3-2 > div.result-header-details-header.clearfix > h1 > span:nth-child(2)"
      );
      const score = await scoreElement.getText();
      page["score"] = getNumberFromText(score);

      const gpuInfo = await getLoadedElement(
        "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(2) > dl"
      );
      const gpuInfoFields = await gpuInfo.findElements(By.css("dt"));
      const gpuInfoValues = await gpuInfo.findElements(By.css("dd"));

      for (let i = 0; i < gpuInfoFields.length; i++) {
        const field = await gpuInfoFields[i].getText();
        const value = await getFieldValue(field, gpuInfoValues[i]);
        setPageValues("gpu", field, value);
      }

      const cpuInfo = await getLoadedElement(
        "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(4) > dl"
      );
      const cpuInfoFields = await cpuInfo.findElements(By.css("dt"));
      const cpuInfoValues = await cpuInfo.findElements(By.css("dd"));

      for (let i = 0; i < cpuInfoFields.length; i++) {
        const field = await cpuInfoFields[i].getText();
        const value = await getFieldValue(field, cpuInfoValues[i]);
        setPageValues("cpu", field, value);
      }

      const generalInfo = await getLoadedElement(
        "#body > div.container > div.column1.maincontent > div > div.column3-2 > div > div:nth-child(5) > dl"
      );
      const generalInfoFields = await generalInfo.findElements(By.css("dt"));
      const generalInfoValues = await generalInfo.findElements(By.css("dd"));

      for (let i = 0; i < generalInfoFields.length; i++) {
        const field = await generalInfoFields[i].getText();
        const value = await getFieldValue(field, generalInfoValues[i]);
        setPageValues("general", field, value);
      }

      if (isFirstRun) {
        isFirstRun = false;
        stream.write(fields.join(","));
        stream.write("\n");
      }

      let row = fields.map((field) => page[field]);
      stream.write(row.join(","));
      stream.write("\n");
    } catch (e) {
      errstream.write(`${randomEightDigitNum}\t${e.message}\n`);
    }
  }
});
// });
