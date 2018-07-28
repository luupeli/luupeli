import React from 'react'
import userService from '../services/users'
import { Link, Redirect } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'

class User extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			userId: this.props.location.state.id,
			redirect: false,
			redirectTo: '',
			viewedUserName: '',
			viewedUserEmail: '',
			user: null
		}
		window.onunload = function () { window.location.href = '/' }
	}

	componentDidMount() {
		userService.get(this.state.userId)
			.then((response) => {
				this.setState({
					viewedUserName: response.data.username,
					viewedUserEmail: response.data.email
				})
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
		if (this.state.redirect) {
			return (
				<Redirect to={{
					pathname: this.state.redirectTo,
				}} />
			)
		}
		return (
			<div className="menu-background App">
				<Link to='/users'>
					<button className="gobackbutton">Takaisin</button>
				</Link>
				<h2>Käyttäjä {this.state.viewedUserName}</h2>
				<p>Sähköposti: {this.state.viewedUserEmail}</p>
			</div >
		)
	}
}

export default User
