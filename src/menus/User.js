import React from 'react'
import userService from '../services/users'
import { Link, Redirect } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'

class User extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			//userId is the id that was given in UserListing, inside Redirect
			userId: this.props.location.state.id,
			redirect: false,
			redirectTo: '',
			//Some information about the user being viewed below
			viewedUserName: '',
			viewedUserEmail: '',
			//user is just the user viewing this page (admin!), nothing to do with the user
			//being viewed
			user: null
		}
		window.onunload = function () { window.location.href = '/' }
	}

	componentDidMount() {
		//Let's fetch the user we want using userService, we already have the id,
		//so let's GET the user of that specific id
		//so we can put some useful information of them in the state
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
		//And this is just for setting the user, although unless the user is an admin
		//they're going to need to gtfo of this page immediately
		//so then we're setting redirect to true and redirectTo to /login.
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
		//If redirect is set to true, we will redirect. It might, no, WILL be true,
		//if the user trying to view this page is not an admin.
		if (this.state.redirect) {
			return (
				<Redirect to={{
					pathname: this.state.redirectTo,
				}} />
			)
		}
		//If redirect is not true, AKA user is an admin, we can show them some
		//dank information of whomever this page belongs to.
		return (
			<div className="menu-background App">
				<Link to='/users'>
					<button className="gobackbutton">Takaisin</button>
				</Link>
				<font size="4"><div>
				<h2>Käyttäjä {this.state.viewedUserName}</h2>
				<p>Sähköposti: {this.state.viewedUserEmail}</p><br></br>
				<p>Peliä pelattu kaikkiaan: 3 min 36 s</p>
				<p>Pelattuja pelejä: 23</p>
				<p>Oikeita vastauksia: 52 joista suurin osa alueella eturaaja, koira</p>
				<p>Vääriä vastauksia: 17 joista suurin osa alueella pää, hevonen</p>
				</div>
				</font>
			</div >
		)
	}
}

export default User
