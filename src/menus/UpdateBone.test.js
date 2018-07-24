const puppeteer = require('puppeteer')
require('dotenv').config()

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
	await page.waitForSelector('#username-form').then(async () => {
		await page.type('#username-form', username)
		await page.type('#password-form', password)
		await page.click('#login-button')
	})
	await page.waitForSelector('#logout-button')
	// await page.screenshot({ path: 'bones7331.png' })
}, 30000)

beforeEach(async () => {
	// page = await browser.newPage()
	await page.goto('http://localhost:3000/listing')
	// await page.screenshot({ path: 'bones1337.png' })
	//Click on first listed bone to navigate to update form
	await page.waitForSelector('#bone0')
	await page.click('#bone0')
})

// afterEach(async () => {
// 	await page.close()
// })

afterAll(async () => {
	await page.goto('http://localhost:3000/login')
	await page.waitForSelector('#logout-button')
	await page.click('#logout-button')
	await browser.close()
})

describe('UpdateBone tests', () => {

	test('Pressing "Lisää kuvakenttä"-button adds a new image field', async () => {

		//Wait for image field addition button to render on page
		await page.waitForSelector('#addNewImageFieldButton')

		//Wait for a while for the page to render possibly already existing images
		//Otherwise the number of .list-group-items might not match
		await page.waitFor(2000)

		//Save number of li-elements before clicking button for comparison
		const elementList = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})

		await page.click('#addNewImageFieldButton')

		//Save number of li-elements after clicking button for comparison
		const elementListAfterAdd = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})

		//There should be one more li-element after clicking button
		expect(elementListAfterAdd.length).toBe(elementList.length + 1)
	}, 20000)

	test('Pressing "Poista kuvakenttä"-button removes one new image field', async () => {

		//Wait for image field addition button to render on page
		await page.waitForSelector('#addNewImageFieldButton')

		//Wait for a while for the page to render possibly already existing images
		//Otherwise the number of .list-group-items might not match
		await page.waitFor(2000)

		await page.click('#addNewImageFieldButton')

		//Save number of li-elements before clicking button for later comparison
		const elementList = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})

		//Wait for image field removal button to render and click it
		await page.waitForSelector('#removeNewImageFieldButton')
		await page.click('#removeNewImageFieldButton')

		//Save number of li-elements after clicking button for later comparison
		const elementListAfterRemove = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})

		//There should be one less li-element after clicking button
		expect(elementListAfterRemove.length).toBe(elementList.length - 1)
	}, 20000)

	test('Pressing "Poista"-button on a previously uploaded image notifies user that the image will be deleted', async () => {

		//Wait for image deletion button to render and click it
		await page.waitForSelector('#deleteImageButton0')
		await page.click('#deleteImageButton0')

		//Check if any of the li-elements on the page contains the text notifying user that the image will be deleted on save
		//Return true if notification text is found, false otherwise
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

		//Notification text should be found
		expect(foundNotif).toBe(true)
	}, 20000)

	test('Pressing "Peruuta poisto"-button on a previously uploaded image unhides image fields', async () => {

		//Wait for image deletion button to render and click it twice to delete and then undo the deletion
		await page.waitForSelector('#deleteImageButton0')
		await page.click('#deleteImageButton0')
		await page.click('#deleteImageButton0')

		//Check if any of the li-elements on the page contains the text notifying user that the image will be deleted on save
		//Return true if notification text is found, false otherwise
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

		//Notification text should not be found
		expect(foundNotif).toBe(false)
	}, 20000)

	test('Pressing "Takaisin listaukseen"-button leads to listing', async () => {

		//Wait for back button to render and click it
		await page.waitForSelector('#backToListing')
		await page.click('#backToListing')

		//Check the text content of the list rendered on page to check we are at listing view
		const textContent = await page.$eval('#listGroup', el => el.textContent)
		expect(textContent.toLowerCase().includes("suodata lajin mukaan")).toBe(true)
	}, 20000)
})
