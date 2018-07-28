import React from 'react'
import userService from '../services/users'
import { Link, Redirect } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'

class UserListing extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			redirect: false,
			redirectTo: '',
			allUsers: [],
			user: null
		}
		// see Admin.js if you want to know more about why this is here.
		window.onunload = function () { window.location.href = '/' }
	}

	// Using userService to fetch all users. this.state.allUsers will hold the response data,
	// so we'll have our adorable users there. If an error is thrown, log it.
	// We'll also be setting the user, if we have a loggedLohjanLuunkeraajaUser value.
	// 'Cause then the user, namely admin, is logged in. Yo.
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

	// Here we return the names and email addresses of our users as a list.
	// If a user is an admin, we put a star next to their name.
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
						//For every user in allUsers, name and email will be shown
						{this.state.allUsers.map(aUser => {
							if (aUser.role.toUpperCase() === 'ADMIN') {
							//We'll need the id on the user's page, so we are forwarding
							//it like this, in the state (going to users/:id)
								return <Link key={aUser.id} to={{
									pathname: '/users/' + aUser.id,
									state: {
										id: aUser.id
									}
								}}>&#9733; {aUser.username} (sähköposti: {aUser.email})<p></p></Link>
							} else {
								//Copypaste, kill me
								return <Link key={aUser.id} to={{
									pathname: '/users/' + aUser.id,
									state: {
										id: aUser.id,
									}
								}}>{aUser.username} (sähköposti: {aUser.email})<p></p></Link>
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
