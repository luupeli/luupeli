import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import BackButton from '../BackButton'

class Admin extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			allStyles: JSON.parse(localStorage.getItem("allStyles")),
			styleIndex: localStorage.getItem('styleIndex'),	
			redirect: false,  // false, because we obviously won't be redirecting yet.
			redirectTo: '', 	// empty string, because we've nowhere to redirect to.
			user: null
		}

		// Most likely a temporary fix, the browser back button works in a funny way...
		// it may take the user 'back' to a page they haven't event visited.
		// What we want this function to do is to take the user back to the page they were
		// on before Luupeli. Sometimes it does that. Nonetheless, it doesn't take the user
		// to some page they haven't been on, as far as I know.
		window.onunload = function () { window.location.href = '/' }
		this.proceed = this.proceed.bind(this)
	}

	componentDidMount() {
		const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			if (user.role !== "ADMIN") {
				this.setState({ redirect: true, redirectTo: '/' })
			}
			this.setState({ user })
		} else {
			this.setState({ redirect: true, redirectTo: '/' })
		}
	}

	// We know, based on the id of the calling event, which button has been clicked.
	// So we modify redirectTo based on that. Redirect will be set to true in any case,
	// so this.state.redirect will be true the next time we render() and the page will
	// change accordingly.
	proceed(event) {
		if (event.target.id === 'boneList') {
			this.setState({ redirect: true, redirectTo: '/listing' })
		} else if (event.target.id === 'userList') {
			this.setState({ redirect: true, redirectTo: '/users' })
		} else if (event.target.id === 'adminStatistics') {
			this.setState({redirect : true, redirectTo : '/statistics'})
		}
	}

	// If redirect is set to true, we will redirect. Else, we will render the admin page,
	// which contains buttons leading to other pages meant for the admin.
	render() {
		let i = this.state.styleIndex
		
		// Redirects
		if (this.state.redirect) {
			return (
				<Redirect to={{
					pathname: this.state.redirectTo,
				}} />
			)
		}

		return (
			<div className={this.state.allStyles[i].overlay}>
				<div className={this.state.allStyles[i].background}>
          <div className={this.state.allStyles[i].style}>
				<div className='App'>
					<h2>Ylläpitäjän sivu</h2>
					<BackButton redirectTo='/' />
					<div id='adminButtons' className='btn-group'>
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
						<Row className="show-grid">
							<Col>
								<button className="menu-button" id="adminStatistics" onClick={this.proceed}>
									Statistiikka
           		</button>
							</Col>
						</Row>
					</div>
				</div>
			</div>
				</div>
			</div>
		)
	}
}

export default Admin
