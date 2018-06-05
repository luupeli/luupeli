import React from 'react'
import { shallow } from 'enzyme'
import WritingGame from './WritingGame'

describe("WritingGame", () => {
	const wgcomponent = () => {
		const writingGameComponent = shallow(<WritingGame />)
		return writingGameComponent;
	}

	it('renders the title', () => {
		const titleDiv = wgcomponent().find('.title')
		expect(titleDiv.text()).toContain('Syötä luun nimi')
	})

	it("always renders a div", () => {
		const divs = wgcomponent().find("div");
		expect(divs.length).toBeGreaterThan(0)
	})

	it("has everything to be rendered inside the first div", () => {
		const writingGameComponent = wgcomponent()
		const divs = writingGameComponent.find("div");
		const wrap = divs.first();
		expect(wrap.children()).toEqual(writingGameComponent.children())
	})
})