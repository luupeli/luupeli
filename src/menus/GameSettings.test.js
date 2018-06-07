import React from 'react'
import { shallow, mount } from 'enzyme'
import WritingGame from '../games/writinggame/WritingGame'
import { Redirect, Link } from 'react-router-dom'
import WGMessage from '../games/writinggame/WGMessage'
import GameSettings from './GameSettings'

describe("GameSettings", () => {
	const settings = () => {
		const settings = shallow(<GameSettings />)
		return settings;
	}

	it("always renders a div", () => {
        const stngs = settings()
		const divs = stngs.find("div")
        expect(divs.length).toBeGreaterThan(0)

        stngs.setState({redirect: true})
        expect(divs.length).toBeGreaterThan(0)
    })
    
    it("starts with everything set to false", () => {
        expect(settings().state().bodyParts[0].checked).toBe(false)
        expect(settings().state().bodyParts[1].checked).toBe(false)
        expect(settings().state().bodyParts[2].checked).toBe(false)
        expect(settings().state().bodyParts[3].checked).toBe(false)
        expect(settings().state().redirect).toBe(false)
    })

    it("doesn't render Redirect when variable redirect is set to false", () => {
        expect(settings().find(Redirect).length).toBe(0)
    })

    it("renders Redirect when variable redirect is set to true", () => {
        const stngs = settings()
        stngs.setState({redirect : true})
        expect(stngs.find(Redirect).length).toBe(1)
    })

    it("renders WGMessage when not redirecting", () => {
        expect(settings().find(WGMessage).length).toBe(1)
    })

    it("renders Link for using a button to go back to the previous page", () => {
        expect(settings().find(Link).length).toBe(1)
    })

    it("finds four checkboxes for the body parts", () => {
        const checkboxes = settings().find('.checkbox-inline')
        expect(checkboxes.length).toBe(4)
    })

})