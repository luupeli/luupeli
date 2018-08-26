const puppeteer = require('puppeteer')
require('dotenv').config()

const port = process.env.FRONT_PORT

let browser
let page

jest.setTimeout(12000000)

beforeAll(async () => {
	browser = await puppeteer.launch({ args: ['--no-sandbox'], slowMo: 250 })
})

beforeEach(async () => {
	page = await browser.newPage()
	await page.setViewport({ width: 1280, height: 800 })
	await page.goto('http://localhost:' + port)
	await page.waitFor(100)
	await page.goto('http://localhost:' + port + '/gamemode')
	await page.waitFor(100)
	await page.goto('http://localhost:' + port + '/settings')
})

afterEach(async () => {
	await page.close()
})

afterAll(async () => {
	await browser.close()
})

describe('GameSettings tests', () => {
	test('page renders', async () => {
		await page.waitFor(500)
	//	await page.waitForSelector('#luupeliinButton')
		await page.screenshot({ path: 'gameSettings.png' })
		const textContent = await page.$eval('#App', el => el.textContent)
		await page.screenshot({ path: 'gameSettings2.png' })
		await page.waitFor(500)
		expect(textContent.toLowerCase().trim().includes("ca")).toBe(true)
	})
})
