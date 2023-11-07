import {Builder, By, until} from 'selenium-webdriver';
// const options = new Options();
// const driver = await new Builder().forBrowser('chrome').setChromeOptions(options.addArguments('--headless=new')).build();
const driver = await new Builder().forBrowser('chrome').build();
await driver.get('https://www.3dmark.com/spy/36197169')
const scoreElement = driver.findElement(By.css('#body > div.container > div.result-header.clearfix.mb0.hidden > div.result-header-details.column3-2 > div.result-header-details-header.clearfix > h1 > span:nth-child(2)'))
// console.log("scoreElement: ", scoreElement);
await driver.wait(until.elementTextMatches(scoreElement, new RegExp(".+")), 10000);
const scoreText = await scoreElement.getText()
const score = parseInt(scoreText.replace(/\s/g, ''))
console.log("score: ", score);