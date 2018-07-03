const puppeteer = require('puppeteer')

let browser
let page

beforeAll(async () => {
	browser = await puppeteer.launch()
	page = await browser.newPage()
	await page.setViewport({ width: 1280, height: 800 })
})

beforeEach(async () => {
	page = await browser.newPage()
	await page.goto('http://localhost:3000/listing')
})

afterEach(async () => {
	await page.close()
})

afterAll(async () => {
	await browser.close()
})

describe('BoneListing tests', () => {
	test('Lisää uusi-button leads to an empty form', async () => {
		const expectedInput = ""
		await page.click('#addNewBoneButton')
		const nameLatinField = await page.evaluate(() => 
			document.querySelector('#nameLatin').textContent)
		
		expect(nameLatinField).toBe(expectedInput)
	}, 20000)
	
	/*test('Added bone is visible on BoneListing', async () => {
		const expectedInput = ""
		await page.click('#addNewBoneButton')
		await page.type('#nameLatin', )
	}, 20000)*/
})
