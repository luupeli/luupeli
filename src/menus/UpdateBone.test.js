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
	await page.waitForSelector('#logout-button')
}, 30000)

beforeEach(async () => {
	page = await browser.newPage()
	await page.goto('http://localhost:3000/listing')

	//Click on first listed bone to navigate to update form
	await page.waitForSelector('#bone0')
	await page.click('#bone0')
})

afterEach(async () => {
	await page.close()
})

afterAll(async () => {
	await page.goto('http://localhost:3000/login')
	await page.waitForSelector('#logout-button')
	await page.click('#logout-button')
	await browser.close()
})

describe('UpdateBone tests', () => {

	test('Pressing "Lisää kuvakenttä"-button adds a new image field', async () => {
		await page.waitForSelector('#addNewImageFieldButton')

		//Wait for a while for the page to render possibly already existing images
		//Otherwise the number of .list-group-items might not match
		await page.waitFor(2000)

		const elementList = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})
		await page.click('#addNewImageFieldButton')

		const elementListAfterAdd = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})
		expect(elementListAfterAdd.length).toBe(elementList.length + 1)
	}, 20000)

	test('Pressing "Poista kuvakenttä"-button removes one new image field', async () => {
		await page.waitForSelector('#addNewImageFieldButton')

		//Wait for a while for the page to render possibly already existing images
		//Otherwise the number of .list-group-items might not match
		await page.waitFor(2000)

		await page.click('#addNewImageFieldButton')

		const elementList = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})

		await page.waitForSelector('#removeNewImageFieldButton')
		await page.click('#removeNewImageFieldButton')

		const elementListAfterRemove = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})

		expect(elementListAfterRemove.length).toBe(elementList.length - 1)
	}, 20000)

	test('Pressing "Poista"-button on a previously uploaded image notifies user that the image will be deleted', async () => {
		await page.waitForSelector('#deleteImageButton0')
		await page.click('#deleteImageButton0')

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

		expect(foundNotif).toBe(true)
	}, 20000)

	test('Pressing "Peruuta poisto"-button on a previously uploaded image unhides image fields', async () => {
		await page.waitForSelector('#deleteImageButton0')
		await page.click('#deleteImageButton0')
		await page.click('#deleteImageButton0')

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

		expect(foundNotif).toBe(false)
	}, 20000)

	test('Pressing "Takaisin listaukseen"-button leads to listing', async () => {
		await page.waitForSelector('#backToListing')
		await page.click('#backToListing')

		const textContent = await page.$eval('#listGroup', el => el.textContent)
		expect(textContent.toLowerCase().includes("suodata lajin mukaan")).toBe(true)
	}, 20000)
})
