import { Builder, By, until } from "selenium-webdriver";
import { getFieldValue } from "./elements.mjs";
import fs from "fs";
// const options = new Options();
// const driver = await new Builder().forBrowser('chrome').setChromeOptions(options.addArguments('--headless=new')).build();
const FETCH_COUNT = 100;

const driver = await new Builder().forBrowser("chrome").build();

export const getLoadedElement = async (selector) => {
    try {
        const element = driver.findElement(By.css(selector));
        await driver.wait(
            until.elementTextMatches(element, new RegExp(".+")),
            10000
        );
        return await element;
    } catch (e) {
        return { getText: () => "" };
    }
};

var stream = fs.createWriteStream("training-data.csv");
stream.once("open", async function (fd) {
  for (let i = 0; i < FETCH_COUNT; i++) {
    let errorElement;
    do {
        errorElement = undefined;
      const randomEightDigitNum = Math.floor(Math.random() * 10 ** 8);
      console.log("Fetching ", randomEightDigitNum);
      await driver.get("https://www.3dmark.com/spy/" + randomEightDigitNum);

      errorElement = await getLoadedElement(
        "#body > div.container > div > div.column3-2.maincontent > div > div > div.error"
      );
    } while (errorElement.getText());
    const page = {};

    const setPageValues = (section, field, value) => {
        switch (field) {
            case "sli / crossfire":
                page[field] = value.toLowerCase() === "on";
                break;

            case "clock frequency":
            case "memory clock frequency":
                ([page[section + " " + field + " min"], page[section + " " + field + " max"]] = value);
                break;

            case "pyhsical / logical processors":
                ([page[section + " physical processors"], page[section + " logical processors"]] = value);
                break;

            case "module 1":
            case "module 2":
                ([page[section + " " + field + " size"], page[section + " " + field + " brand"], page[section + " " + field + " speed"]] = value);
                break;

            case "hard drive model":
                ([page[section + " " + field + " size"], page[section + " " + field]] = value);

            default:
                page[field] = value;
                break;
        }   
    }

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

    driver.close();

    console.log("page:", page);

    if (i === 0) {
      fields = Object.keys(page);
      stream.write(fields.join(","));
      stream.write("\n");
    }

    let row = fields.map((field) => page[field]);
    stream.write(row.join(","));
    stream.write("\n");
  }

  stream.end();
  driver.close();
});
