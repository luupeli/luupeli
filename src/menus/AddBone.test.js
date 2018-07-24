const puppeteer = require('puppeteer')

let browser
let page

beforeAll(async () => {
	browser = await puppeteer.launch({args: ['--no-sandbox']})
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
	page = await browser.newPage()
	await page.setViewport({ width: 1280, height: 800 })
})

beforeEach(async () => {
	page = await browser.newPage()
  await page.goto('http://localhost:3000/add')
})

afterEach(async () => {
	await page.close()
})

afterAll(async () => {
	await browser.close()
})

describe('AddBone tests', () => {

  test('Pressing "Lisää kuvakenttä"-button adds a new image field', async () => {
		await page.waitForSelector('#addNewImageFieldButton')
		
		//Wait for li-elements to render
		await page.waitFor(2000)
		
		//Save the number of li-elements before clicking button for comparison
		const elementList = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})
		
    await page.click('#addNewImageFieldButton')
    
    //Wait for li-elements to render
    await page.waitFor(2000)
    
    //Save the number of li-elements after clicking for comparison
		const elementListAfterAdd = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})
		
		//There should be one more li-element after clicking button
		expect(elementListAfterAdd.length).toBe(elementList.length + 1)
  }, 20000)
  
  test('Pressing "Poista kuvakenttä"-button removes one new image field', async () => {
    await page.waitForSelector('#addNewImageFieldButton')
    await page.click('#addNewImageFieldButton')
    
    //Wait for li-elements to render
    await page.waitFor(2000)
    
    //Save number of li-elements before clicking button for comparison
		const elementList = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})
		
    await page.waitForSelector('#removeNewImageFieldButton')
    await page.click('#removeNewImageFieldButton')
    
    //Wait for li-elements to render
    await page.waitFor(2000)
    
    //Save number of li-elements after clicking button for comparison
		const elementListAfterRemove = await page.evaluate(() => {
			const lis = Array.from(document.querySelectorAll('.list-group-item'))
			return lis.map(li => li.textContent)
		})
		
		//There should be one less li-element after clicking button
		expect(elementListAfterRemove.length).toBe(elementList.length - 1)
  }, 20000)
  
  test('Pressing "Takaisin listaukseen"-button leads to listing', async () => {
    await page.waitForSelector('#backToListing')
    await page.click('#backToListing')
    
    //Get text content from the bone list
    const textContent = await page.$eval('#listGroup', el => el.textContent)
    expect(textContent.toLowerCase().includes("suodata lajin mukaan")).toBe(true)
  }, 20000)
})
