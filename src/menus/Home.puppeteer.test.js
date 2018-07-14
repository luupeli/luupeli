import React from 'react'
import { shallow, mount, render } from 'enzyme'
import { Link } from 'react-router-dom'
import Home from './Home'

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
  //global.Promise = require.requireActual('promise')
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000; 

  page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('http://localhost:3000')
})

beforeEach(async () => {
  page = await browser.newPage()
  await page.goto('http://localhost:3000')
})

afterEach(async () => {
  await page.close()
})

afterAll(async () => {
  await browser.close()
})

describe("Home (puppeteer) tests", () => {

  it('should open page', async () => {
    page = await browser.newPage()
    const response = await retry(() => page.goto('http://localhost:3000'), 2000)
    //Does it need to be 200?
    console.log(response.status());
    assert.equal(response.status(), 304)
  })

  test('page renders', async () => {
    const textContent = await page.$eval('#homeMenu', el => el.textContent)
    expect(textContent.includes("Luupeli")).toBe(true)
  }, 20000)

  test('Pelaa button redirects to SelectGameMode page', async () => {
    
    await page.click('#proceedToSelectGameMode')
    const textContent = await page.$eval('#gameBody', el => el.textContent)
    expect(textContent.includes("Kirjoituspeli")).toBe(true)
  }, 2500)

  test('Login button redirects to Login page', async () => {
    
    await page.click('#homeMenuLoginButton')
    const textContent = await page.$eval('#loginPromptMenu', el => el.textContent)
    expect(textContent.includes("Luukirjaudu sisään")).toBe(true)
  }, 2500)

  test('Sign-up button redirects to Sign-up page', async () => {
    
    await page.click('#homeMenuSignUpButton')
    const textContent = await page.$eval('#registerMenu', el => el.textContent)
    expect(textContent.includes("luukäyttäjätunnus")).toBe(true)
  }, 2500)

  test('CSS Theme is changeable', async () => {
    
    // const preTextContent = await page.$eval('#styleName', el => el.preTextContent)
    // expect(preTextContent.includes("blood-dragon")).toBe(true)
    
	await page.waitForSelector('#themeChangeButton')
    await page.click('#themeChangeButton')
    const textContent = await page.$eval('#styleName', el => el.textContent)
    expect(textContent.includes("blood-dragon")).toBe(false)
  }, 2500)

  
  


 
})

