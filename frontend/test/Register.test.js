const puppeteer = require('puppeteer')
require('dotenv').config()

const port = process.env.PORT

let browser
let page

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
	await page.waitForSelector('#homeMenuSignUpButton')
	// Navigates to sign up screen
	await page.click('#homeMenuSignUpButton')
})

afterAll(async () => {
	// Close the browser
	await browser.close()
})

describe('When user navigates to sign up page', () => {

	test('user can not register an account with mismatching passwords', async () => {
		// Wait for sign up forms to render
		await page.waitForSelector('.form-control').then(async () => {
			// Fill in sign up data with random username
			await page.type('#username-form', 'poejg' + Math.floor(Math.random() * Math.floor(100)))
			await page.type('#password-form', 'salasana1')
			await page.type('#repeat-password-form', 'salasana2')
			// Click sign up button
			await page.click('#signup-button')
		})
		// Evaluates whether the error message is rendered
		await page.waitForSelector('#error-message')
		const textContent = await page.$eval('#error-message', el => el.textContent)
		expect(textContent.includes("salasanat eivät täsmää")).toBe(true)
	})

	test('user can not register an account with a short username', async () => {
		// Wait for sign up forms to render
		await page.waitForSelector('.form-control').then(async () => {
			// Fill in sign up data
			await page.type('#username-form', 'aa')
			await page.type('#password-form', 'salasana1')
			await page.type('#repeat-password-form', 'salasana1')
			// Click sign up button
			await page.click('#signup-button')
		})
		// Evaluates whether the logout button is rendered
		await page.waitForSelector('#error-message')
		await page.screenshot({ path: 'afterFailedRegister1.png' })
		const textContent = await page.$eval('#error-message', el => el.textContent)
		expect(textContent.includes("käyttäjätunnus tai salasana on virheellinen")).toBe(true)
	})

	test('user can not register an account with a short password', async () => {
		// Wait for sign up forms to render
		await page.waitForSelector('.form-control').then(async () => {
			// Fill in sign up data
			await page.type('#username-form', 'aiojf' + Math.floor(Math.random() * Math.floor(100)))
			await page.type('#password-form', 'salasan')
			await page.type('#repeat-password-form', 'salasan')
			// Click sign up button
			await page.click('#signup-button')
		})
		// Evaluates whether the logout button is rendered
		await page.waitForSelector('#error-message')
		await page.screenshot({ path: 'afterFailedRegister2.png' })
		const textContent = await page.$eval('#error-message', el => el.textContent)
		expect(textContent.includes("käyttäjätunnus tai salasana on virheellinen")).toBe(true)
	})

	test('back button takes the user back to the main page', async () => {
		// Click back button and evaluate if login button in the gome screen is rendered
		await page.waitForSelector('#goBackButton')
		await page.click('#goBackButton')
		await page.waitForSelector('#homeMenuSignUpButton')
		const textContent = await page.$eval('#homeMenuSignUpButton', el => el.textContent)
		expect(textContent.includes("Luo käyttäjätili")).toBe(true)
	})
})