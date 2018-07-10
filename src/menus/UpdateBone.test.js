const puppeteer = require('puppeteer')

let browser
let page

beforeAll(async () => {
	browser = await puppeteer.launch({args: ['--no-sandbox']})
	page = await browser.newPage()
	await page.setViewport({ width: 1280, height: 800 })
})

beforeEach(async () => {
	page = await browser.newPage()
	await page.goto('http://localhost:3000/listing')
	
	//Click on first listed bone to navigate to update form
	await page.waitForSelector('#bone0')
	await page.click('#bone0')
	/*await page.waitForSelector('#bones')
   	const elementList = await page.evaluate(selector => {
			const buttons = Array.from(document.querySelectorAll('.list-group-item-action'))
			return buttons.map(button => button.textContent)
		}, 'div')
   	const linkHandlers = await page.$x(`//*[contains(text(), elementList[0])]`);
	await linkHandlers[0].click();*/
})

afterEach(async () => {
	await page.close()
})

afterAll(async () => {
	await browser.close()
})

describe('UpdateBone tests', () => {

  test('Pressing "Lisää kuvakenttä"-button adds a new image field', async () => {
	await page.waitForSelector('#addNewImageFieldButton')
	
	//Wait for a while for the page to render possibly already existing images
	//Otherwise the number of .list-group-items might not match
	await page.waitFor(4000)
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
    await page.waitFor(4000)
    
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
  
  test('Pressing "Takaisin listaukseen"-button leads to listing', async () => {
    await page.waitForSelector('#backToListing')
    await page.click('#backToListing')
    
    const textContent = await page.$eval('#listGroup', el => el.textContent)
    expect(textContent.includes("Suodata lajin mukaan")).toBe(true)
  }, 20000)
})
