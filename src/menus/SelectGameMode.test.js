import React from 'react'
import { shallow, mount, render } from 'enzyme'
import { Link } from 'react-router-dom'
import SelectGameMode from './SelectGameMode'

// var localStorageMock = (function() {
//   var store = {}
//   return {
//     getItem: function(key) {
//       return store[key]
//     },
//     setItem: function(key, value) {
//       store[key] = value.toString()
//     },
//     clear: function() {
//       store = {}
//     },
//     removeItem: function(key) {
//       delete store[key]
//     }
//   }
// })()
// Object.defineProperty(window, 'localStorage', { value: localStorageMock })

const retry = (fn, ms) => new Promise(resolve => {
  fn()
    .then(resolve)
    .catch(() => {
      setTimeout(() => {
        console.log('retrying...')
        retry(fn, ms).then(resolve)
      }, ms)
    })
})

const puppeteer = require('puppeteer')
const assert = require('assert')

let browser
let page



beforeAll(async () => {
  browser = await puppeteer.launch({ args: ['--no-sandbox --disable-http2'] })
  //  browser = await puppeteer.launch()
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
  page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('http://localhost:3000')
})

beforeEach(async () => {
  page = await browser.newPage()
  await page.goto('http://localhost:3000/gamemode')
})

afterEach(async () => {
  await page.close()
})

afterAll(async () => {
  await browser.close()
})

describe("SelectGameMode tests", () => {

  it('should open page', async () => {
    page = await browser.newPage()
    const response = await retry(() => page.goto('http://localhost:3000'), 1000)
    //Does it need to be 200?
    assert.equal(response.status(), 304)
  })

  test('page renders', async () => {
    const textContent = await page.$eval('#gameBody', el => el.textContent)
console.log(textContent)
    expect(textContent.toLowerCase().includes("luupelimuoto")).toBe(true)
  }, 20000)

  test('Takaisin button redirects back to main page', async () => {
    await page.click('#goBackButton')
    const textContent = await page.$eval('#homeMenu', el => el.textContent)
    expect(textContent.includes("Pelaa")).toBe(true)
  })

  //   it("renders a Link that takes you to the game", () => {
  //     const component = shallow(<SelectGameMode />)

  //     const toprow = component.find('.toprow')
  //     expect(gameltoprow.length).toBe(1)

  //    })

})

// import React from 'react'
// import { shallow } from 'enzyme'
// import { Link } from 'react-router-dom'
// import SelectGameMode from './SelectGameMode'

// describe("SelectGameMode", () => {

//     var localStorageMock = (function() {
//       var store = {}
//       return {
//         getItem: function(key) {
//           return store[key]
//         },
//         setItem: function(key, value) {
//           store[key] = value.toString()
//         },
//         clear: function() {
//           store = {}
//         },
//         removeItem: function(key) {
//           delete store[key]
//         }
//       }
//     })()
//     Object.defineProperty(window, 'localStorage', { value: localStorageMock })

//     const gamemode = () => {
//         const component = shallow(<SelectGameMode />)
//         return component
//     }

//     it('has the text "Valitse"', () => {
//         const res = gamemode().find('.toprow')
//         expect(res.text()).toContain('Valitse')
//     })

//     it('has the text "Luupelimuoto:"', () => {
//         // const res = gamemode().find('.secondrow')
//         // expect(res.text()).toContain('Luupelimuoto:')
//     })

//     it('has "Kirjoituspeli" (writing game) as one of the game modes', () => {
//         // const res = gamemode().find('.writinggame')
//         // expect(res.text()).toContain('Kirjoituspeli')
//     })

//     //broken..
//     //it('has a "Takaisin" button for going back to the previous page', () => {
//         //const res = gamemode().find('.gobackbutton')
//         //expect(res.text()).toContain('Takaisin')
//     //})

//     it('renders Links', () => {
//         // expect(gamemode().find(Link).length).toBeGreaterThan(0)
//     })

//     it('renders buttons', () => {
//         // expect(gamemode().find("button").length).toBeGreaterThan(0)
//     })
// })
