const puppeteer = require('puppeteer')
const assert = require('assert')

let browser
let page

const retry = (fn, ms) => new Promise(resolve => {
  fn()
    .then(resolve)
    .catch(() => {
      setTimeout(() => {
        console.log('retrying...')
        retry(fn, ms).then(resolve)
      }, ms)
    })
})

beforeAll(async () => {
  browser = await puppeteer.launch({ args: ['--no-sandbox --disable-http2'] })
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
  page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('http://localhost:3000')
})

beforeEach(async () => {
  page = await browser.newPage()
  await page.goto('http://localhost:3000/gamemode')
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
    const response = await retry(() => page.goto('http://localhost:3000'), 1000)
    //Does it need to be 200?
    assert.equal(response.status(), 304)
  })

  test('page renders', async () => {
    const textContent = await page.$eval('#gameBody', el => el.textContent)
    console.log(textContent)
    expect(textContent.toLowerCase().includes("luupelimuoto")).toBe(true)
  }, 20000)

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