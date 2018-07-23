import React from 'react'
import userService from '../services/users'
import { Link } from 'react-router-dom'
import { Row, Col, Grid, FormControl } from 'react-bootstrap'

class UserListing extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
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
			this.setState({ user })
		}
	}

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
