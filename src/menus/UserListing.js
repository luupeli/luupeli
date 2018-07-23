import React from 'react'
import userService from '../services/users'
import { Link, Redirect } from 'react-router-dom'
import { Row, Col, Grid, FormControl } from 'react-bootstrap'

class UserListing extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			redirect: false,
			redirectTo: '',
			allUsers: [],
			user: null
		}

		window.onunload = function () { window.location.href = '/' }
	}

	componentDidMount() {
		userService.getAll()
			.then((response) => {
				this.setState({ allUsers: response.data })
			})
			.catch((error) => {
				console.log(error)
			})
		const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			if (user.role !== "ADMIN") {
				this.setState({ redirect: true, redirectTo: '/login' })
			}
			this.setState({ user })
		} else {
			this.setState({ redirect: true, redirectTo: '/login' })
		}
	}

	render() {
		// Redirects
		if (this.state.redirect) {
			return (
				<Redirect to={{
					pathname: this.state.redirectTo,
				}} />
			)
		}
		return (
			<div className="menu-background App">
				<h2>Käyttäjälista</h2>
				<p>&#9733; = ylläpitäjä</p>
				<br></br>
				<Link to='/admin'>
					<button className="gobackbutton">Takaisin</button>
				</Link>
				<Row>
					<Col>
						{this.state.allUsers.map(aUser => {
							if (aUser.role.toUpperCase() === 'ADMIN') {
								return <p>&#9733; {aUser.username} (sähköposti: {aUser.email})</p>
							} else {
								return <p>{aUser.username} (sähköposti: {aUser.email})</p>
							}
						}
						)}
					</Col>
				</Row>
			</div >
		)
	}
}

export default UserListing
