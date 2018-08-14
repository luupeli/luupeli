const puppeteer = require('puppeteer')

const port = process.env.PORT

let browser
let page

beforeAll(async () => {
	browser = await puppeteer.launch({ args: ['--no-sandbox'] })
	page = await browser.newPage()
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000
	await page.setViewport({ width: 1280, height: 800 })
})

beforeEach(async () => {
	page = await browser.newPage()
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
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000
		//Navigate to Select Game Mode-screen
		console.log("navigating from main page to game mode selection")
		await page.waitForSelector('#proceedToSelectGameMode')
		// await page.screenshot({ path: 'menu1.png', fullPage: true });
		await page.click('#proceedToSelectGameMode')

		//Navigate to WritingGame settings page
		console.log("navigating from game mode selection to game settings")
		await page.waitForSelector('#writingGameButton')
		// await page.screenshot({ path: 'menu2.png', fullPage: true });
		await page.click('#writingGameButton')
		
		//Select settings and begin game
		// await page.screenshot({ path: 'menu3.png', fullPage: true });
		await page.waitForSelector('#gameLength')
		const gameLength = await page.$eval('#gameLength', el => el.value)
		console.log(gameLength)

		await page.waitForSelector('#gameEasy')
		await page.click('#gameEasy')

		console.log("navigating to game")
		await page.waitForSelector('#luupeliinButton')
		await page.screenshot({ path: 'beforeGame.png', fullPage: true });
		await page.click('#luupeliinButton')

		//Play game
		playRounds(gameLength)

		//Look at endscreen results
		console.log("looking at endscreen")
		await page.waitForSelector('#endScreenTitle', { timeout: 0 })
		// await page.screenshot({ path: 'end.png', fullPage: true });
		const textContent = await page.$eval('#endScreenTitle', el => el.textContent)

		expect(textContent.toLowerCase().includes("vastauksesi")).toBe(true)
	}, 40000)

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
