import React from 'react'
import { shallow, mount, render } from 'enzyme'
import { Link } from 'react-router-dom'
import Home from './Home'


//import { expect } from 'chai'
import ReactDOM from 'react-dom'
import TestRenderer from 'react-test-renderer'

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

// const root = TestRenderer.create(<Home />).root
// const instance = root.instance
// instance.setState({
//   allStyles: [{
//     style:'blood-dragon',
//     background:'background-blood-dragon',
//     flairLayerD:'grid-sub',
//     flairLayerC:'grid',
//     flairLayerB:'grid-flair',
//     flairLayerA:'blinder',
//     primary:'#ff5db1',
//     secondary:'#ff2596',
//     tertiary:'#ef007c'
//   }, {
//     style:'blood-dragon',
//     background:'background-blood-dragon',
//     flairLayerD:'grid-sub',
//     flairLayerC:'grid',
//     flairLayerB:'grid-flair',
//     flairLayerA:'blinder',
//     primary:'#ff5db1',
//     secondary:'#ff2596',
//     tertiary:'#ef007c'
//   }]
//   , 
//   styleIndex: 0})
// console.assert(root.findByType(Counter).props.count === 0)
// console.assert(instance.state.count === 0)



/*  MELKEIN TOIMIVAA... 
const testRenderer = TestRenderer.create(<Home />)
const testInstance = testRenderer.root
expect(testInstance.findByProps({className: "background-blood-dragon"}).children).to.equal(["background-blood-dragon"])
*/


// it('has the name of the game, Luupeli', () => {
//   const title = home().find('.gametitle')
//   expect(title.text()).toContain('Luupeli')
// })

// global.expect = expect
beforeEach(function () {

  global.sessionStorage = jest.genMockFunction();
  // jest.setTimeout(30000)
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
  global.sessionStorage.setItem = jest.genMockFunction();
  global.sessionStorage.getItem = jest.genMockFunction();
})

describe('Home', () => {

  let wrapper

  const home = () => {

    const HOME_PROPS = {
      allStyles: [{
        style: 'blood-dragon',
        background: 'background-blood-dragon',
        flairLayerD: 'grid-sub',
        flairLayerC: 'grid',
        flairLayerB: 'grid-flair',
        flairLayerA: 'blinder',
        primary: '#ff5db1',
        secondary: '#ff2596',
        tertiary: '#ef007c'
      }, {
        style: 'blood-dragon',
        background: 'background-blood-dragon',
        flairLayerD: 'grid-sub',
        flairLayerC: 'grid',
        flairLayerB: 'grid-flair',
        flairLayerA: 'blinder',
        primary: '#ff5db1',
        secondary: '#ff2596',
        tertiary: '#ef007c'
      }]
      ,
      styleIndex: 0
    }

    const HOME_STATE = {
      allStyles: [{
        style: 'blood-dragon',
        background: 'background-blood-dragon',
        flairLayerD: 'grid-sub',
        flairLayerC: 'grid',
        flairLayerB: 'grid-flair',
        flairLayerA: 'blinder',
        primary: '#ff5db1',
        secondary: '#ff2596',
        tertiary: '#ef007c'
      }, {
        style: 'blood-dragon',
        background: 'background-blood-dragon',
        flairLayerD: 'grid-sub',
        flairLayerC: 'grid',
        flairLayerB: 'grid-flair',
        flairLayerA: 'blinder',
        primary: '#ff5db1',
        secondary: '#ff2596',
        tertiary: '#ef007c'
      }]
      ,
      styleIndex: 0,
      style: 'blood-dragon',
      background: 'background-blood-dragon',
      flairLayerD: 'grid-sub',
      flairLayerC: 'grid',
      flairLayerB: 'grid-flair',
      flairLayerA: 'blinder',
      primary: '#ff5db1',
      secondary: '#ff2596',
      tertiary: '#ef007c'
    }

    const component = shallow(<Home {...HOME_STATE} />)

    return component
  }

  describe('<Home />', () => {
    var localStorageMock = (function () {
      var store = { styleIndex: '0', allStyles: [] }
      return {
        getItem: function (key) {
          return store[key]
        },
        setItem: function (key, value) {
          store[key] = value.toString()
        },
        clear: function () {
          store = {}
        },
        removeItem: function (key) {
          delete store[key]
        }
      }
    })()
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  })

  it("renders a Link that takes you to the game", () => {

    const gamelink = home().find('.gamelink')
    expect(gamelink.length).toBe(1)
  })

  it("has a working button for changing CSS theme", () => {
    const wrapper = shallow(<Home />)
    expect(wrapper.state('styleIndex')).toBe(0)
    expect(
      wrapper.containsMatchingElement(
        <div className="blood-dragon" />
      )
    ).toBeTruthy()

    wrapper.find('#themeChangeButton').simulate('click')
    expect(wrapper.state('styleIndex')).toBe(1)
    //    console.log(wrapper.state()) 
  })

  it("has a working button for changing CSS theme, part II", () => {

    const wrapper = mount(<Home />)
    wrapper.setState({ 'styleIndex': 0 })
    wrapper.find('#themeChangeButton').simulate('click')
    //console.log(wrapper.debug())
    //await new Promise((resolve) => setTimeout(resolve, 0))
    const updatedWrapper = wrapper.update()
    //  console.log(wrapper.debug())
    expect(
      updatedWrapper.containsMatchingElement(
        <div className="blood-dragon" />
      )
    ).toBeFalsy()
  })

  // it("moves on to SelectGameMode when it wants to", () => {


  //   const wrapper = mount(<Home />)


  //   wrapper.find('.gamelink').simulate('click')
  //   expect(
  //     wrapper.containsMatchingElement(
  //       <h2 className="secondrow">Luupelimuoto:</h2>
  //     )
  //   ).toTruthy()
  // })

  it('renders buttons', () => {
    expect(home().find("button").length).toBeGreaterThan(0)
  })

  it('has the name of the game, Luupeli', () => {
    const title = home().find('.game-title')
    expect(title.text()).toContain('Luupeli')
  })

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