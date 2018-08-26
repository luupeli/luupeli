const puppeteer = require('puppeteer')
require('dotenv').config()

const twoBones = [
  {
    id: 1,
    nameLatin: "latin1",
    altNameLatin: "",
    description: "",
    name: "suomi1",
    bodyPart: { name: "Eturaaja" },
    attempts: 0,
    correctAttempts: 0,
    animals: [{ name: "Koira", _id: "5b2b8c851867cd00142634e7" }, { name: "Hevonen", _id: "5b2b8c9b1867cd00142634ea" }, { name: "Nauta", _id: "5b2b8c951867cd00142634e9" }, { name: "Kissa", _id: "5b2b8c8d1867cd00142634e8" }]
  },
  {
    id: 2,
    nameLatin: "latin2",
    altNameLatin: "",
    description: "",
    name: "suomi2",
    bodyPart: { name: "Eturaaja" },
    attempts: 0,
    correctAttempts: 0,
    animals: [{ name: "Hevonen", _id: "5b2b8c9b1867cd00142634ea" }]
  }
]

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
  //For some reason the tests seem to hang and timeout around page.$eval() or expect() when using page.removeAllListeners()
  //So instead we close the page after tests, open a new page and then re-login to unsubscribe leftover event listeners
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
  })

  // Checks if animal selector texts appear on the page
  test('animals appear', async () => {
    await page.waitForSelector("#animals")
    await page.waitFor(2000)
    const textContent = await page.$eval('#listGroup', el => el.textContent)
    expect(textContent.toLowerCase().includes("ca")).toBe(true)
  })

  // Checks if bodypart selector texts appear on the page
  test('bodyparts appear', async () => {
    await page.waitForSelector("#bodyparts")
    await page.waitFor(2000)
    const textContent = await page.$eval('#listGroup', el => el.textContent)
    expect(textContent.toLowerCase().includes("eturaaja")).toBe(true)
  })

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
  })

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
  // })

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
  })

/*  test('Page renders fetched bones', async () => {
    //Allow request interception, set a handler to handle intercepted requests
  //  await page.setRequestInterception(true)
  //  setResponseHandler(twoBones)

    //Re-navigate to listing page to re-fire the get-request for bones
    await page.goto('http://localhost:' + port)
    await page.goto('http://localhost:' + port + '/listing')
    //Look at bones listed on the page
    await page.waitForSelector('#bone0')
    const textContent1 = await page.$eval('#bone0', el => el.textContent)
    const textContent2 = await page.$eval('#bone1', el => el.textContent)

    //Listing should contain the names given in the mocked request response
    expect(textContent1.includes("latin1")).toBe(true)
    expect(textContent2.includes("latin2")).toBe(true)

  })

  test('Bones can be filtered by latin name', async () => {
    //Allow request interception, set a handler to handle intercepted requests
  //  await page.setRequestInterception(true)
  //  setResponseHandler(twoBones)

    //Re-navigate to listing page to re-fire the get-request for bones
    await page.goto('http://localhost:' + port)
    await page.goto('http://localhost:' + port + '/listing')
    //Look at bones listed on the page
    await page.waitForSelector('#searchByKeyword')
    await page.type('#searchByKeyword', "scapula")
    await page.waitForSelector('#bones')
    const textContent1 = await page.$eval('#bones', el => el.textContent)
    const textContent2 = await page.$eval('#bones', el => el.textContent)

    //Listing should only contain bones with names matching the search criteria
    expect(textContent1.includes("scapula")).toBe(true)
    expect(textContent2.includes("latin2")).toBe(false)

  })*/

	/*
	test('Bones can be filtered by animal', async () => {
		//Allow request interception, set a handler to handle intercepted requests
		await page.setRequestInterception(true)
		setResponseHandler(responseMocks.twoBones)
	
		//Re-navigate to listing page to re-fire the get-request for bones
		await page.goto('http://localhost:' + port)
		await page.goto('http://localhost:' + port + '/listing')
		//Look at bones listed on the page
		await page.waitForSelector('#animal0')
		const animalName = await page.$eval('#animal0', el => el.textContent)
		await page.click('#animal0')
		await page.waitForSelector('#bone0')
		const textContent1 = await page.$eval('#bones', el => el.textContent)
		console.log(animalName)
		console.log(textContent1)

		//Listing should only contain bones with animals matching the search criteria
		expect(textContent1.toLowerCase().trim().includes("koira")).toBe(true)
		
	})
	*/

  async function setResponseHandler(mockResponse) {
    page.on('request', request => {
      if (request.url() === 'http://localhost:' + port + '/api/bones') {
        //Intercept and respond to requests to the above url with mock data
        request.respond({
          content: 'application/json; charset=utf-8',
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify(mockResponse)
        })
      } else {
        //Let other requests continue normally
        request.continue()
      }
    })
  }
})
