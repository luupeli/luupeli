const puppeteer = require('puppeteer')

let browser
let page

beforeAll(async () => {
	browser = await puppeteer.launch({ args: ['--no-sandbox'] })
	page = await browser.newPage()
	await page.setViewport({ width: 1280, height: 800 })
})

beforeEach(async () => {
	page = await browser.newPage()
	await page.goto('http://localhost:3000/')
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
		await page.waitForSelector('#proceedToSelectGameMode')
		await page.click('#proceedToSelectGameMode')

		//Navigate to WritingGame settings page
		console.log("navigating from game mode selection to game settings")
		await page.waitForSelector('#writingGameButton')
		await page.click('#writingGameButton')

		//Select settings and begin game
		console.log("selecting settings")
		await page.waitForSelector('#animal1')
		await page.click('#animal0')
		await page.click('#animal1')
		await page.click('#animal2')
		await page.click('#animal3')
		await page.waitForSelector('#bodyPart1')
		await page.click('#bodyPart0')
		await page.click('#bodyPart1')
		await page.click('#bodyPart2')
		await page.click('#bodyPart3')

		await page.waitForSelector('#gameLengthShort')
		await page.click('#gameLengthShort')
		const gameLength = await page.$eval('#gameLengthShort', el => el.value)
		console.log(gameLength)

		await page.waitForSelector('#gameEasy')
		await page.click('#gameEasy')

		console.log("navigating to game")
		await page.waitForSelector('#luupeliinButton')
		await page.click('#luupeliinButton')

		//Play game
		for (var i = 0; i < gameLength; i++) {
			console.log("starting round no. " + (i + 1))
			await page.waitForSelector('#gameTextInput')
			await page.type('#gameTextInput', "testivastaus")
			await page.waitForSelector('#submitButton')
			await page.click('#submitButton')
		}

		//Look at endscreen results
		console.log("looking at endscreen")
		await page.waitForSelector('#endScreenTitle', { timeout: 0 })
		const textContent = await page.$eval('#endScreenTitle', el => el.textContent)

		expect(textContent.toLowerCase().includes("lopputulos")).toBe(true)
	}, 20000)

})
