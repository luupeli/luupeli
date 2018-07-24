const puppeteer = require('puppeteer')
require('dotenv').config()

const username = process.env.USERNAME
const password = process.env.PASSWORD

let browser
let page

// An admin user must be logged-in in order to pass these tests,
// and it is done in this beforeAll block
beforeAll(async () => {
	browser = await puppeteer.launch({ args: ['--no-sandbox'] })
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000
	page = await browser.newPage()
	await page.setViewport({ width: 1280, height: 800 })
	// Navigates to home
	await page.goto('http://localhost:3000')
	// Waits for a button to render
	await page.waitForSelector('#homeMenuLoginButton')
	// Navigates to login screen
	await page.click('#homeMenuLoginButton')
	// Waits for the forms to render and types in the credentials
	await page.waitForSelector('.form-control').then(async () => {
		await page.type('#username-form', username)
		await page.type('#password-form', password)
		await page.click('#login-button')
	})
	// Finally waits for the logout button to render which shows after a user is logged in
	await page.waitForSelector('#logout-button')
}, 30000)

beforeEach(async () => {
	await page.goto('http://localhost:3000/admin')
}, 20000)

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
