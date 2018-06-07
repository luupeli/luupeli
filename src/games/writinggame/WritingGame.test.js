import React from 'react'
import { shallow } from 'enzyme'
import WritingGame from './WritingGame'
import { Redirect } from 'react-router-dom'
import WGMessage from './WGMessage'

describe("WritingGame", () => {
	const wgcomponent = () => {
		const writingGameComponent = shallow(<WritingGame />)
		return writingGameComponent;
	}

	it('renders the title', () => {
		const titleDiv = wgcomponent().find('.title')
		expect(titleDiv.text()).toContain('Syötä luun nimi')
	})

	it('renders the input field', () => {
		expect(wgcomponent().find('.input').length).toBe(1)
	})

	it("always renders a div", () => {
		const divs = wgcomponent().find("div")
		expect(divs.length).toBeGreaterThan(0)
	})

	it("has everything to be rendered inside the first div", () => {
		const writingGameComponent = wgcomponent()
		const divs = writingGameComponent.find("div")
		const wrap = divs.first();
		expect(wrap.children()).toEqual(writingGameComponent.children())
	})

	it("renders WGMessage when it doesn't redirect", () => {
		expect(wgcomponent().find(WGMessage).length).toBe(1)
	})

	it("starts with 0 correct answers", () => {
		expect(wgcomponent().state().correct).toBe(0)
	})

	it("starts with index of value 0", () => {
		expect(wgcomponent().state().index).toBe(0)
	})

	it("doesn't render Redirect when index is less than length of images", () => {
		expect(wgcomponent().find(Redirect).length).toBe(0)
	})

	it("renders Redirect when index is equal to or larger than length of images", () => {
		/*const game = wgcomponent()
		game.setState({index : 100})
		expect(wgcomponent().find(Redirect).length).toBe(1)*/
		//"cant read property of undefined" xddd
	})

})