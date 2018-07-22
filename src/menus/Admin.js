import React from 'react'
import { Redirect } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'

class Admin extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			redirect: false,
			redirectTo: ''
		}

		window.onunload = function () { window.location.href = '/' }
		this.proceed = this.proceed.bind(this)
	}

	proceed(event) {
		if (event.target.id === 'boneList') {
			this.setState({ redirect: true, redirectTo: '/listing' })
		} else if (event.target.id === 'userList') {
			this.setState({redirect : true, redirectTo: '/users'})
		}
	}

	render() {
		if (this.state.redirect) {
			return (
				<Redirect to={{
					pathname: this.state.redirectTo,
				}} />
			)
		}
		return (
			<div className="menu-background">
				<div className='App'>
					<Row className="show-grid">
						<Col>
							<button className="menu-button" id="boneList" onClick={this.proceed}>
								Luut
           		</button>
						</Col>
					</Row>
					<Row className="show-grid">
						<Col>
							<button className="menu-button" id="userList" onClick={this.proceed}>
								Käyttäjät
           		</button>
						</Col>
					</Row>
				</div>
			</div>
		)
	}
}

export default Admin