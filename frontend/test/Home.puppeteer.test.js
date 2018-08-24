const puppeteer = require('puppeteer')
const assert = require('assert')
require('dotenv').config()

const port = process.env.PORT

let browser
let page

jest.setTimeout(12000000)

beforeAll(async () => {
  browser = await puppeteer.launch({ args: ['--disable-http2'], slowMo: 250 })
  page = await browser.newPage()
})

beforeEach(async () => {
  page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('http://localhost:' + port)
})

afterEach(async () => {
  await page.close()
})

afterAll(async () => {
  await browser.close()
})

describe("Home (puppeteer) tests", () => {

  it('should open page', async () => {
    page = await browser.newPage()
    const response = await page.goto('http://localhost:' + port)
    await page.waitFor(500)
    assert.equal(response.status(), 200)
  })

  test('page renders', async () => {
    await page.waitFor(500)
    await page.waitForSelector('#homeMenu')
    const textContent = await page.$eval('#homeMenu', el => el.textContent)
    expect(textContent.includes("Luupeli")).toBe(true)
  })

  test('Pelaa button redirects to SelectGameMode page', async () => {
    await page.waitForSelector('#proceedToSelectGameMode')
    await page.click('#proceedToSelectGameMode')
    await page.waitForSelector('#gameBody')
    const textContent = await page.$eval('#gameBody', el => el.textContent)
    expect(textContent.includes("Kirjoituspeli")).toBe(true)
  })

  test('Login button redirects to Login page', async () => {

    await page.waitForSelector('#homeMenuLoginButton')
    await page.click('#homeMenuLoginButton')
    await page.waitForSelector('#loginPromptMenu')
    const textContent = await page.$eval('#loginPromptMenu', el => el.textContent)
    expect(textContent.includes("Luukirjaudu sisään")).toBe(true)
  })

  test('Sign-up button redirects to Sign-up page', async () => {

    await page.waitForSelector('#homeMenuSignUpButton')
    await page.click('#homeMenuSignUpButton')
    await page.waitForSelector('#registerMenu')
    const textContent = await page.$eval('#registerMenu', el => el.textContent)
    expect(textContent.includes("luukäyttäjätunnus")).toBe(true)
  })

  test('CSS Theme is changeable', async () => {
    await page.waitForSelector('#themeChangeButton')
    await page.click('#themeChangeButton')
    await page.waitForSelector('#styleName')
    const textContent = await page.$eval('#styleName', el => el.textContent)
    expect(textContent.includes("normo")).toBe(false)
  })
})

