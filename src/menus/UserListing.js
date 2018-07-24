import React from 'react'
import userService from '../services/users'
import { Link } from 'react-router-dom'
import { Row, Col, Grid, FormControl } from 'react-bootstrap'

class UserListing extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			allUsers: [], // we'll fetch the users in componentDidMount().
			user: null // same, no user yet.
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
			this.setState({ user })
		}
	}

	// Here we return the names and email addresses of our users as a list.
	// If a user is an admin, we put a star next to their name.
	render() {

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
