const puppeteer = require('puppeteer')
require('dotenv').config()

const port = process.env.FRONT_PORT

let browser
let page

jest.setTimeout(120000)

beforeAll(async () => {
	browser = await puppeteer.launch({ args: ['--no-sandbox'], slowMo: 250 })
})

beforeEach(async () => {
	page = await browser.newPage({slowMo: 250})
	await page.setViewport({ width: 1280, height: 800 })
	await page.goto('http://localhost:' + port)
})

afterEach(async () => {
	await page.close()
})

afterAll(async () => {
	await browser.close()
})

describe('WritingGame tests', () => {

	test('easy short playthrough', async () => {
		//Navigate to Select Game Mode-screen
		console.log("navigating from main page to game mode selection")
		await page.waitFor(2000)
		await page.waitForSelector('#proceedToSelectGameMode')
		// await page.screenshot({ path: 'menu1.png', fullPage: true });
		await page.click('#proceedToSelectGameMode')

		//Navigate to WritingGame settings page
		console.log("navigating from game mode selection to game settings")
		await page.waitFor(2000)
		await page.waitForSelector('#writingGameButton')
		// await page.screenshot({ path: 'menu2.png', fullPage: true });
		await page.click('#writingGameButton')
		
		//Select settings and begin game
		// await page.screenshot({ path: 'menu3.png', fullPage: true });
		await page.waitForSelector('#gameLengthShort')
		const gameLength = await page.$eval('#gameLengthShort', el => el.value)
		console.log(gameLength)

		await page.waitForSelector('#gameEasy')
		await page.click('#gameEasy')

		console.log("navigating to game")
		await page.waitForSelector('#luupeliinButton')
		await page.screenshot({ path: 'beforeGame.png', fullPage: true });
		await page.click('#luupeliinButton')

		//Play game
		await playRounds(gameLength)

		//Look at endscreen results
		console.log("looking at endscreen")
		await page.waitFor(5000)
		await page.waitForSelector('#endScreenTitle')
		// await page.screenshot({ path: 'end.png', fullPage: true });
		const textContent = await page.$eval('#endScreenTitle', el => el.textContent)

		expect(textContent.toLowerCase().includes("vastauksesi")).toBe(true)
	})

	async function playRounds(gameLength) {
		for (var i = 0; i < gameLength; i++) {
			console.log("starting round no. " + (i + 1))
			await page.waitForSelector('#bone-image').then(async () => {
				await page.waitForSelector('#gameTextInput')
				await page.type('#gameTextInput', "testivastaus")
				await page.waitForSelector('#submitButton')
				// await page.screenshot({ path: `beforeSubmit${i + 1}.png`, fullPage: true });
				await page.click('#submitButton')
			})
		}
	}
})
