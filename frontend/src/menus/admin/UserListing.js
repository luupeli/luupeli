import React from 'react'
import userService from '../../services/users'
import { Link, Redirect } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import BackButton from '../BackButton'

class UserListing extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			allStyles: JSON.parse(localStorage.getItem("allStyles")),
			styleIndex: localStorage.getItem('styleIndex'),	
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
				//Sort the list of users alphabetically
				response.data.sort((userA, userB) => userA.username.localeCompare(userB.username))
				this.setState({ allUsers: response.data })
			})
			.catch((error) => {
				console.log(error)
			})
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

	// Here we return the names of our users as a list.
	// If a user is an admin, we put a star next to their name.
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
			<div className="App">
				<h2>Käyttäjälista</h2>
				<font size="4"><p>&#9733; = ylläpitäjä</p></font>
				<br></br>
				<BackButton redirectTo='/admin' />
				<div id='listOfUsers'>
					<Row>
						<Col>
							{this.state.allUsers.map(aUser => { //For every user in allUsers, name will be shown
								if (aUser.role.toUpperCase() === 'ADMIN') {
									//We'll need the id on the user's page, so we are forwarding
									//it like this, in the state (going to users/:id)
									return <Link key={aUser.id} to={{
										pathname: '/users/' + aUser.id,
										state: {
											id: aUser.id
										}
									}}>&#9733; {aUser.username}<p></p></Link>
								} else {
									//Copypaste, kill me
									return <Link key={aUser.id} to={{
										pathname: '/users/' + aUser.id
									}}>{aUser.username}<p></p></Link>
								}
							}
							)}
						</Col>
					</Row>
				</div>
			</div >
			</div>
				</div>
			</div>
		)
	}
}

export default UserListing
