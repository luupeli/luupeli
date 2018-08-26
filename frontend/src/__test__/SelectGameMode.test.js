const puppeteer = require('puppeteer')
const assert = require('assert')
require('dotenv').config()

const port = process.env.FRONT_PORT

let browser
let page

jest.setTimeout(120000)

beforeAll(async () => {
  browser = await puppeteer.launch({ args: ['--no-sandbox'], slowMo: 250 })
})

beforeEach(async () => {
  page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('http://localhost:' + port + '/gamemode')
})

afterEach(async () => {
  await page.close()
})

afterAll(async () => {
  await browser.close()
})

describe("SelectGameMode tests", () => {

  it('should open page', async () => {
    page = await browser.newPage()
    const response = await page.goto('http://localhost:' + port)
    assert.equal(response.status(), 200)
  })

  test('page renders', async () => {
    await page.waitForSelector('#gameBody')
    const textContent = await page.$eval('#gameBody', el => el.textContent)
    console.log(textContent)
    expect(textContent.toLowerCase().includes("luupelimuoto")).toBe(true)
  })

  test('Takaisin button redirects back to main page', async () => {
    await page.waitForSelector('#goBackButton')
    await page.click('#goBackButton')
    const textContent = await page.$eval('#homeMenu', el => el.textContent)
    expect(textContent.includes("Pelaa")).toBe(true)
  })

  //   it("renders a Link that takes you to the game", () => {
  //     const component = shallow(<SelectGameMode />)

  //     const toprow = component.find('.toprow')
  //     expect(gameltoprow.length).toBe(1)

  //    })

})
