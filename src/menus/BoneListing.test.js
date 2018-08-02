import responseMocks from '../helpers/ResponseMocks'
const puppeteer = require('puppeteer')
require('dotenv').config()

const username = process.env.USERNAME
const password = process.env.PASSWORD
const port = process.env.PORT

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
}, 30000)

beforeEach(async () => {
  await page.goto('http://localhost:' + port + '/listing')
})

afterAll(async () => {
  await page.goto('http://localhost:' + port + '/login')
  await page.waitForSelector('#logout-button')
  await page.click('#logout-button')
  await browser.close()
})

describe('BoneListing tests', () => {

  // Checks if text appears on the page, thus renders
  test('page renders', async () => {
    const textContent = await page.$eval('#listGroup', el => el.textContent)
    expect(textContent.includes("Suodata lajin mukaan")).toBe(true)
  }, 20000)

  // Checks if animal selector texts appear on the page
  test('animals appear', async () => {
    await page.waitForSelector("#animals")
    await page.waitFor(2000)
    const textContent = await page.$eval('#listGroup', el => el.textContent)
    console.log(textContent)
    expect(textContent.toLowerCase().includes("koira")).toBe(true)
  }, 20000)

  // Checks if bodypart selector texts appear on the page
  test('bodyparts appear', async () => {
    await page.waitForSelector("#bodyparts")
    await page.waitFor(2000)
    const textContent = await page.$eval('#listGroup', el => el.textContent)
    console.log(textContent)
    expect(textContent.toLowerCase().includes("eturaaja")).toBe(true)
  }, 20000)

  // Checks if pressing the new form button leads to an empty form; checks if form doesn't contain text
  test('Lisää uusi-button leads to an empty form', async () => {

    // Wait for bone addition button to render and click
    await page.waitForSelector('#addNewBoneButton')
    await page.click('#addNewBoneButton')

    // Check the text content/value on nameLatin field
    const nameLatinField = await page.evaluate(() =>
      document.querySelector('#nameLatin').textContent)

    // The value on nameLatin field should be an empty string
    expect(nameLatinField).toBe("")
  }, 20000)

  //* This test works with screenshots, but not always. It also shouldn't run with production database *//
  // test('Added bone appears on BoneListing', async () => {
  // 	const expectedInput = "lallallaa"
  //   await page.click('#addNewBoneButton')

  //   await page.type('#nameLatin', expectedInput)
  //   await page.screenshot({ path: 'lallallaa.png' })

  //   await page.waitForSelector('#addBone')
  //   await page.click("#submitNewBoneButton")
  //   await page.screenshot({ path: 'afterSubmit.png' })

  //   await page.click('#backToListing')
  //   await page.waitForSelector("#bones")
  //   await page.screenshot({ path: 'bonesAfterPost.png' })
  //   const textContent = await page.$eval('#listGroup', el => el.textContent)
  //   console.log(textContent)
  //   expect(textContent.includes(expectedInput)).toBe(true)
  // }, 20000)

  //checks if clicking on the bone leads to an update view
  test('Clicking a listed bone leads to a pre-filled form', async () => {

    // Wait for a listed bone to render on the page
    // Save the name of the bone for later comparison, then click it
    await page.waitForSelector('#bone0')
    const boneName = await page.$eval('#bone0', el => el.textContent)
    await page.click('#bone0')

    // Wait for nameLatin field to render and check its text content/value
    await page.waitForSelector('#nameLatin')
    const nameLatinField = await page.$eval('#nameLatin', el => el.textContent)

    // The saved bone name and field value should match
    // .include is used because boneName string may also contain other information,
    // eg. animals related to the bone
    expect(boneName.includes(nameLatinField)).toBe(true)
  }, 20000)
  
  test('Page renders fetched bones', async () => {
		//Allow request interception
		await page.setRequestInterception(true)
		
		//Set a handler to handle intercepted requests
		page.on('request', request => {
		//console.log("request intercepted")
		//console.log(request.url())
    if (request.url() === 'http://luupeli-backend.herokuapp.com/api/bones') {
			//Intercept and respond to requests to the above url with mock data
			//console.log("responding....")
        request.respond({
					content: 'application/json; charset=utf-8',
          headers: {"Access-Control-Allow-Origin": "*"},
          body: JSON.stringify(responseMocks.twoBones)
        })
    } else {
			//Let other requests continue normally
      request.continue()
    }
	})
	
	//Re-navigate to listing page to re-fire the get-request for bones
	await page.goto('http://localhost:' + port)
	await page.goto('http://localhost:' + port + '/listing')
	//Look at bones listed on the page
  await page.waitForSelector('#bone0')
  const textContent1 = await page.$eval('#bone0', el => el.textContent)
  const textContent2 = await page.$eval('#bone1', el => el.textContent)
  console.log(textContent1)

  //Listing should contain the names given in the mocked request response
  expect(textContent1.includes("latin1")).toBe(true)
  expect(textContent2.includes("latin2")).toBe(true)
		
	}, 20000)
})
