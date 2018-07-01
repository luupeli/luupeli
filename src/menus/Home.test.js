import React from 'react'
import { shallow } from 'enzyme'
import { Link } from 'react-router-dom'
import Home from './Home'

describe("Home", () => {

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

    const home = () => {
        const component = shallow(<Home />)
        return component;
    }

    it('renders Links', () => {
        expect(home().find(Link).length).toBeGreaterThan(0)
    })

    it("renders a Link that takes you to the game", () => {
        const gamelink = home().find(".gamelink")
        expect(gamelink.length).toBe(1)
    })

    it('renders buttons', () => {
        expect(home().find("button").length).toBeGreaterThan(0)
    })

    it('has the name of the game, Luupeli', () => {
        const title = home().find('.gametitle')
		expect(title.text()).toContain('Luupeli')
    })
})