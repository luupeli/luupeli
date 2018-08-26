const puppeteer = require('puppeteer')
require('dotenv').config()

const username = process.env.USERNAME
const password = process.env.PASSWORD
const port = process.env.FRONT_PORT

let browser
let page
let loggedIn = false // Helper variable

jest.setTimeout(12000000)

beforeAll(async () => {
	browser = await puppeteer.launch({ args: ['--no-sandbox'], slowMo: 250 })
	page = await browser.newPage()
	await page.setViewport({ width: 1280, height: 800 })
})

beforeEach(async () => {
	// Navigates to home
	await page.goto('http://localhost:' + port)
	// Waits for a button to render
	await page.waitForSelector('#homeMenuLoginButton')
	// Navigates to login screen
	await page.click('#homeMenuLoginButton')
})

afterEach(async () => {
	// Logout if loggedIn
	if (loggedIn) {
		await page.goto('http://localhost:' + port + '/login')
		await page.waitForSelector('#logout-button')
		await page.click('#logout-button')
		loggedIn = false
	}
})

afterAll(async () => {
	// Close the browser
	await browser.close()
})

describe('When there is a registered user account', () => {

	describe('and user navigates to login page', () => {

		test('user can log in and is redirected to the main page', async () => {
			// Wait for login forms to render
			await page.waitForSelector('.form-control').then(async () => {
				// Fill in login data
				await page.type('#username-form', username)
				await page.type('#password-form', password)
				// Click login button
				await page.click('#login-button')
				loggedIn = true
			})
			// Evaluates whether the logout button is rendered
			await page.waitForSelector('#logout-button')
			const textContent = await page.$eval('#logout-button', el => el.textContent)
			expect(textContent.includes("Kirjaudu ulos")).toBe(true)
		})

		test('user can log in and log out', async () => {
			// Same as above
			await page.waitForSelector('.form-control').then(async () => {
				await page.type('#username-form', username)
				await page.type('#password-form', password)
				await page.click('#login-button')
				loggedIn = true
			})
			// Logout
			await page.waitForSelector('#logout-button')
			await page.click('#logout-button')
			loggedIn = false
			// Evaluates whether login button in home screen is rendered
			await page.waitForSelector('#homeMenuLoginButton')
			const textContent = await page.$eval('#homeMenuLoginButton', el => el.textContent)
			expect(textContent.includes("Kirjaudu sisään")).toBe(true)
		})

		test('back button takes the user back to the main page', async () => {
			// Click back button and evaluate if login button in the gome screen is rendered
			await page.waitForSelector('#goBackButton')
			await page.click('#goBackButton')
			await page.waitForSelector('#homeMenuLoginButton')
			const textContent = await page.$eval('#homeMenuLoginButton', el => el.textContent)
			expect(textContent.includes("Kirjaudu sisään")).toBe(true)
		})
	})
})
