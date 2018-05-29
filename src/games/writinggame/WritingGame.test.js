import React from 'react'
import { shallow } from 'enzyme'
import WritingGame from './WritingGame'

describe.only('<WritingGame />', () => {
	it('renders content', () => {
		const writingGameComponent = shallow(<WritingGame />)
		const titleDiv = writingGameComponent.find('.title')

		expect(titleDiv.text()).toContain('Syötä luun nimi')
	})
})