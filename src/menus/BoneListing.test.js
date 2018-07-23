const puppeteer = require('puppeteer')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const username = process.env.USERNAME
const password = process.env.PASSWORD

let browser
let page

beforeAll(async () => {
  browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
  page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' })
  await page.type('#username-form', username)
  await page.type('#password-form', password)
  await Promise.all([
    page.click('#login-button'),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ])
})

beforeEach(async () => {
  page = await browser.newPage()
  await page.goto('http://localhost:3000/listing')
})

afterEach(async () => {
  await page.close()
})

afterAll(async () => {
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' })
  await page.click('#logout-button')
  await browser.close()
})

describe('BoneListing tests', () => {

  test('page renders', async () => {
    const textContent = await page.$eval('#listGroup', el => el.textContent)
    expect(textContent.includes("Suodata lajin mukaan")).toBe(true)
  }, 20000)

  test('animals appear', async () => {
    await page.waitForSelector("#animals")
    //Not having this screenshot will break the tests..
    await page.screenshot({ path: 'animals.png' })
    const textContent = await page.$eval('#listGroup', el => el.textContent)
    expect(textContent.toLowerCase().includes("koira")).toBe(true)
  }, 20000)

  test('bodyparts appear', async () => {
    await page.waitForSelector("#bodyparts")

    await page.screenshot({ path: 'bones.png' })
    const textContent = await page.$eval('#listGroup', el => el.textContent)
    expect(textContent.toLowerCase().includes("eturaaja")).toBe(true)
  }, 20000)

  test('Lisää uusi-button leads to an empty form', async () => {
    const expectedInput = ""
    await page.click('#addNewBoneButton')

    const nameLatinField = await page.evaluate(() =>
      document.querySelector('#nameLatin').textContent)

    expect(nameLatinField).toBe(expectedInput)
  }, 20000)

  //* This test works with screenshots, but not always. It also shouldn't run with production database *//
  // test('Added bone appears on BoneListing', async () => {
  // 	const expectedInput = "lallallaa"
  //   await page.click('#addNewBoneButton')

  //   await page.type('#nameLatin', expectedInput)
  //   await page.screenshot({ path: 'lallallaa.png' })

  //   await page.waitForSelector('#addBone')
  //   await page.click("#submitNewBoneButton")
  //   await page.screenshot({ path: 'afterSubmit.png' })

  //   await page.click('#backToListing')
  //   await page.waitForSelector("#bones")
  //   await page.screenshot({ path: 'bonesAfterPost.png' })
  //   const textContent = await page.$eval('#listGroup', el => el.textContent)
  //   console.log(textContent)
  //   expect(textContent.includes(expectedInput)).toBe(true)
  // }, 20000)

  test('Clicking a listed bone leads to a pre-filled form', async () => {
    await page.waitForSelector('#bone0')
    const expectedInput = await page.$eval('#bone0', el => el.textContent)
    await page.click('#bone0')

    await page.waitForSelector('#nameLatin')
    const nameLatinField = await page.$eval('#nameLatin', el => el.textContent)

    expect(expectedInput.includes(nameLatinField)).toBe(true)
  }, 20000)


})
