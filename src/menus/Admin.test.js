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
	await page.goto('http://localhost:3000/login')
	await page.type('#username', username)
	await page.type('#password', password)
	await Promise.all([
		page.click('#login-button'),
		page.waitForNavigation()
	])
})

beforeEach(async () => {
	page = await browser.newPage()
	await page.goto('http://localhost:3000/admin')
})

afterEach(async () => {
	await page.close()
})

afterAll(async () => {
	await page.goto('http://localhost:3000/login')
	await page.click('#logout-button')
	await browser.close()
})

describe('Admin tests', () => {

	test('page renders', async () => {

		const textContent = await page.$eval('#adminButtons', el => el.textContent)
		expect(textContent.includes("Luut")).toBe(true)
		expect(textContent.includes("Käyttäjät")).toBe(true)
	}, 20000)

	test('pressing "Luut" takes the user to BoneListing', async () => {

		await page.waitForSelector('#boneList')
		await page.click('#boneList')

		const textContent = await page.$eval('#listGroup', el => el.textContent)
		expect(textContent.toUpperCase().includes("SUODATA LAJIN MUKAAN")).toBe(true)
	}, 20000)
})
