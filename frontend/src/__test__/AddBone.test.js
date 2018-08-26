const puppeteer = require('puppeteer')
require('dotenv').config()

// Get the admin credentials for loggin in
// These are needed for the tests to pass
// They're stoted in the the env variables
const username = process.env.USERNAME
const password = process.env.PASSWORD
const port = process.env.FRONT_PORT

let browser
let page

jest.setTimeout(120000)

// An admin user must be logged-in in order to pass these tests,
// and it is done in this beforeAll block
beforeAll(async () => {
	browser = await puppeteer.launch({ args: ['--no-sandbox'], slowMo: 250 })
	page = await browser.newPage()
	await page.setViewport({ width: 1280, height: 800 })
	// Navigates to home
	await page.goto('http://localhost:' + port)
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
})

beforeEach(async () => {
	await page.goto('http://localhost:' + port + '/add')
})

afterAll(async () => {
	await page.goto('http://localhost:' + port + '/login')
	await page.waitForSelector('#logout-button')
	await page.click('#logout-button')
	await browser.close()
})

describe('AddBone tests', () => {

	test('Pressing "Lisää kuvakenttä"-button adds a new image field', async () => {
		await page.waitForSelector('#addNewImageFieldButton')

		// Wait for li-elements to render
		await page.waitFor(2000)

		// Save the number of li-elements before clicking button for comparison
		const elementList = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})

		await page.click('#addNewImageFieldButton')

		// Wait for li-elements to render
		await page.waitFor(2000)

		// Save the number of li-elements after clicking for comparison
		const elementListAfterAdd = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})

		// There should be one more li-element after clicking button
		expect(elementListAfterAdd.length).toBe(elementList.length + 1)
	})

	test('Pressing "Poista kuvakenttä"-button removes one new image field', async () => {
		await page.waitForSelector('#addNewImageFieldButton')

		// Wait for li-elements to render
		await page.waitFor(2000)
		await page.click('#addNewImageFieldButton')

		// Save number of li-elements before clicking button for comparison
		const elementList = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})

		await page.waitForSelector('#removeNewImageFieldButton')
		await page.click('#removeNewImageFieldButton')

		// Wait for li-elements to render
		await page.waitFor(2000)

		// Save number of li-elements after clicking button for comparison
		const elementListAfterRemove = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})

		// There should be one less li-element after clicking button
		expect(elementListAfterRemove.length).toBe(elementList.length - 1)
	})

	test('Pressing "Takaisin listaukseen"-button leads to listing', async () => {
		await page.waitForSelector('#backToListing')
		await page.click('#backToListing')

		// Get text content from the bone list
		const textContent = await page.$eval('#listGroup', el => el.textContent)
		expect(textContent.toLowerCase().includes("suodata lajin mukaan")).toBe(true)
	})
})
