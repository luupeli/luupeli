const puppeteer = require('puppeteer')
require('dotenv').config()

const username = process.env.USERNAME
const password = process.env.PASSWORD
const port = process.env.PORT

let browser
let page

jest.setTimeout(12000000)

// An admin user must be logged-in in order to pass these tests,
// and it is done in this beforeAll block
beforeAll(async () => {
	browser = await puppeteer.launch({ args: ['--no-sandbox'], slowMo: 250 })
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000
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
	await page.waitFor(500)
	await page.waitForSelector('#logout-button')
})

beforeEach(async () => {
	await page.goto('http://localhost:' + port + '/listing')
	// Click on first listed bone to navigate to update form
	await page.waitForSelector('#bone0')
	await page.click('#bone0')
})

afterAll(async () => {
	await page.goto('http://localhost:' + port + '/login')
	await page.waitForSelector('#logout-button')
	await page.click('#logout-button')
	await page.close()
	await browser.close()
})

describe('UpdateBone tests', () => {

	test('Pressing "Lisää kuvakenttä"-button adds a new image field', async () => {

		// Wait for image field addition button to render on page
		await page.waitForSelector('#addNewImageFieldButton')

		// Wait for a while for the page to render possibly already existing images
		// Otherwise the number of .list-group-items might not match
		await page.waitFor(2000)

		// Save number of li-elements before clicking button for comparison
		const elementList = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})

		await page.click('#addNewImageFieldButton')

		// Save number of li-elements after clicking button for comparison
		const elementListAfterAdd = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})

		// There should be one more li-element after clicking button
		expect(elementListAfterAdd.length).toBe(elementList.length + 1)
	})

	test('Pressing "Poista kuvakenttä"-button removes one new image field', async () => {

		// Wait for image field addition button to render on page
		await page.waitForSelector('#addNewImageFieldButton')

		// Wait for a while for the page to render possibly already existing images
		// Otherwise the number of .list-group-items might not match
		await page.waitFor(2000)
		await page.click('#addNewImageFieldButton')

		// Save number of li-elements before clicking button for later comparison
		const elementList = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})

		// Wait for image field removal button to render and click it
		await page.waitForSelector('#removeNewImageFieldButton')
		await page.click('#removeNewImageFieldButton')

		// Save number of li-elements after clicking button for later comparison
		const elementListAfterRemove = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})

		// There should be one less li-element after clicking button
		expect(elementListAfterRemove.length).toBe(elementList.length - 1)
	})

	test('Pressing "Poista"-button on a previously uploaded image notifies user that the image will be deleted', async () => {

		// Wait for image deletion button to render and click it
		await page.waitForSelector('#deleteImageButton0')
		await page.click('#deleteImageButton0')

		// Check if any of the li-elements on the page contains the text notifying user that the image will be deleted on save
		// Return true if notification text is found, false otherwise
		const foundNotif = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			var foundNotif = false
			lis.forEach(li => {
				if (li.textContent.toLowerCase().includes("poistetaan")) {
					foundNotif = true
				}
			})
			return foundNotif
		})

		// Notification text should be found
		expect(foundNotif).toBe(true)
	})

	test('Pressing "Peruuta poisto"-button on a previously uploaded image unhides image fields', async () => {

		// Wait for image deletion button to render and click it twice to delete and then undo the deletion
		await page.waitForSelector('#deleteImageButton0')
		await page.click('#deleteImageButton0')
		await page.click('#deleteImageButton0')

		// Check if any of the li-elements on the page contains the text notifying user that the image will be deleted on save
		// Return true if notification text is found, false otherwise
		const foundNotif = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			var foundNotif = false
			lis.forEach(li => {
				if (li.textContent.toLowerCase().includes("poistetaan")) {
					foundNotif = true
				}
			})
			return foundNotif
		})

		// Notification text should not be found
		expect(foundNotif).toBe(false)
	})

	test('Pressing "Takaisin listaukseen"-button leads to listing', async () => {

		// Wait for back button to render and click it
		await page.waitForSelector('#backToListing')
		await page.click('#backToListing')

		// Check the text content of the list rendered on page to check we are at listing view
		const textContent = await page.$eval('#listGroup', el => el.textContent)
		expect(textContent.toLowerCase().includes("suodata lajin mukaan")).toBe(true)
	})

})
