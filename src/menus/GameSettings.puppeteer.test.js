const puppeteer = require('puppeteer')

let browser
let page

beforeAll(async () => {
	browser = await puppeteer.launch({args: ['--no-sandbox']})

	jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000; 

	page = await browser.newPage()
	await page.setViewport({ width: 1280, height: 800 })
	await page.goto('http://localhost:3000')

})

beforeEach(async () => {
	page = await browser.newPage()
    await page.goto('http://localhost:3000/settings')
})

afterEach(async () => {
	await page.close()
})

afterAll(async () => {
	await browser.close()
})

describe('GameSettings tests', () => {

	test('page renders', async () => {
		await page.waitForSelector('#luupeliinButton')

		await page.screenshot({ path: 'gameSettings.png' })
		
		const textContent = await page.$eval('#App', el => el.textContent)
		await page.screenshot({ path: 'gameSettings2.png' })
		expect(textContent.includes("Koira")).toBe(true)
		}, 20000)

  })