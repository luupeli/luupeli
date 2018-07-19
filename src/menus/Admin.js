import React from 'react'
import { Redirect } from 'react-router-dom'

class Admin extends React.Component {
	constructor(props) {
		super(props)
		window.onunload = function () { window.location.href = '/' }
	}

	render() {
		return (
			<div className='App'>
				<p></p>
			</div>
		)
	}
}

export default Admin