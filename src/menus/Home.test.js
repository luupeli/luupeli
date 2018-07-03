import React from 'react'
import { shallow,mount,render} from 'enzyme'
import { Link } from 'react-router-dom'
import Home from './Home'
import { expect } from 'chai';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';


global.expect = expect;


describe('Home', () => {

    var localStorageMock = (function() {
      var store = {};
      return {
        getItem: function(key) {
          return store[key];
        },
        setItem: function(key, value) {
          store[key] = value.toString();
        },
        clear: function() {
          store = {};
        },
        removeItem: function(key) {
          delete store[key];
        }
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    let wrapper;


    const home = () => {


      const component = mount(<Home />)
      
      return component;
    }



    

     it("renders a Link that takes you to the game", () => {
    //   const gamelink = home().find("gamelink")
    //   expect(gamelink.length).toBe(1)
     })

    // it('renders buttons', () => {
    //   expect(home().find("button").length).toBeGreaterThan(0)
    // })

    // it('has the name of the game, Luupeli', () => {
    //   const title = home().find('.gametitle')
    //   expect(title.text()).toContain('Luupeli')
    // })

    // describe('home integral tests', () => {
    //   let page
    //   beforeEach(async () => {
    //     page = await global.__BROWSER__.newPage()
    //     await page.goto('http://localhost:3000')
    //   })

    //   it('goes to selectgamemode', async () => {
    //     await page.waitForSelector('.btn-group')
    //     const textContent = await page.$eval('body', el => el.textContent)
    //     expect(textContent.includes('Kirjaudu sisään')).toBe(true)
    //   })
    // })
})