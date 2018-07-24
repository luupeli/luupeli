const puppeteer = require('puppeteer')
require ('dotenv').config()

const username = process.env.USERNAME
const password = process.env.PASSWORD

let browser
let page

beforeAll(async () => {
	browser = await puppeteer.launch({ args: ['--no-sandbox'] })
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000
	page = await browser.newPage()
	await page.setViewport({ width: 1280, height: 800 })
	await page.goto('http://localhost:3000')
	await page.waitForSelector('#homeMenuLoginButton')
	await page.click('#homeMenuLoginButton')
	await page.waitForSelector('.form-control').then(() => {
		page.type('#username-form', username)
		page.type('#password-form', password)
		page.click('#login-button')
	})
	setTimeout(500)
}, 30000)

beforeEach(async () => {
	page = await browser.newPage()
	await page.goto('http://localhost:3000/admin')
}, 20000)

afterEach(async () => {
	await page.close()
})

afterAll(async () => {
	await page.goto('http://localhost:3000/login')
	await page.waitForSelector('#logout-button')
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
