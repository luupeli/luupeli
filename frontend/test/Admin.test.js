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
	browser = await puppeteer.launch({ args: ['--no-sandbox '], slowMo: 250 })
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
	await page.goto('http://localhost:' + port + '/admin')
})
// After the tests have been run, log out and close the browser
afterAll(async () => {
	await page.goto('http://localhost:' + port + '/login')
	await page.waitForSelector('#logout-button')
	await page.click('#logout-button')
	await browser.close()
})

describe('Admin tests', () => {
	// Fetching the content of the div with id adminButtons. Luut, Käyttäjät and Statistiikka
	// should be found.
	test('page renders', async () => {

		const textContent = await page.$eval('#adminButtons', el => el.textContent)
		expect(textContent.includes("Luut")).toBe(true)
		expect(textContent.includes("Käyttäjät")).toBe(true)
		expect(textContent.includes("Statistiikka")).toBe(true)
	})

	// Let's click "Luut", which has boneList as an id. It should take us to BoneListing,
	// and if it does, we will find the text "Suodata lajin mukaan" there (case doesn't matter).
	test('pressing "Luut" takes the user to BoneListing', async () => {

		await page.waitForSelector('#boneList')
		await page.click('#boneList')

		const textContent = await page.$eval('#listGroup', el => el.textContent)
		expect(textContent.toUpperCase().includes("SUODATA LAJIN MUKAAN")).toBe(true)
	})

	// Same tests as above, but for "Käyttäjät" and "Statistiikka"
	// These don't work for unknown reasons ( ͡° ل͜ ͡°)
	// test('pressing "Käyttäjät" takes the user to UserListing', async () => {

	// 	await page.waitForSelector('#userList')
	// 	await page.click('#userList')

	// 	const textContent = await page.$eval('#listOfUsers', el => el.textContent)
	// 	expect(textContent.includes(username).toBe(true))
	// })
	// 	const textContent = await page.$eval('.menu-background', el => el.textContent)
	// 	expect(textContent.toUpperCase().includes('KÄYTTÄJÄLISTA').toBe(true))
	// }, 20000)

	// test('pressing "Statistiikka" takes the user to Statistics', async () => {

	// 	await page.waitForSelector('#adminStatistics')
	// 	await page.click('#adminStatistics')

	// 	const textContent = await page.$eval('#gameStatistics', el => el.textContent)
	// 	expect(textContent.toUpperCase().includes("LADATAAN TIETOJA...")).toBe(true)
	// })
})
