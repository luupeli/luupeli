import React from 'react'
import userService from '../../services/users'
import userStatistics from '../../services/userStatistics'
import { Link, Redirect } from 'react-router-dom'

class User extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			//userId is the id that was given in UserListing, inside Redirect
			userId: this.props.userId,
			redirect: false,
			redirectTo: '',
			//Some information about the user being viewed below
			viewedUserName: '',
			viewedUserEmail: '',
			totalGames: '',
			usersBestGame: '',
			//user is just the user viewing this page, nothing to do with the user
			//being viewed
			user: null,
			goBackTo: '/'
		}
		window.onunload = function () { window.location.href = '/' }
	}

	componentDidMount() {
		//Let's fetch the user we want using userService, we already have the id,
		//so let's GET the user of that specific id
		//so we can put some useful information of them in the state
		userService.get(this.props.userId)
			.then((response) => {
				this.setState({
					viewedUserName: response.data.username,
					viewedUserEmail: response.data.email
				})
			})
		userStatistics.getTotalGamesForIndividual(this.props.userId)
			.then((response) => {
				this.setState({
					totalGames: response.data
				})
			})
		userStatistics.getUsersBestGames(this.props.userId)
			.then((response) => {
				if (response.data.length != 0) {
					this.setState({
						usersBestGame: response.data[0]
					})
				}
			})
			.catch((error) => {
				console.log(error)
			})
		//And this is just for setting the user, although unless the user is an admin
		//or the very user this user page belongs to, they're going to need to gtfo
		//of this page immediately so then we're setting redirect to true and redirectTo to /login.
		const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			if (user.role !== "ADMIN" && user.id !== this.state.userId) {
				this.setState({ redirect: true, redirectTo: '/' })
			}
			this.setState({ user })
			if (user.role === "ADMIN") {
				this.setState({ goBackTo: '/users' })
			}
		} else {
			this.setState({ redirect: true, redirectTo: '/login' })
		}
	}

	bestGame() {

		if (this.state.usersBestGame !== '') {
			return (
				<div>
					<p>&#9733; Paras peli &#9733;</p>
					<p>{this.state.usersBestGame["totalScore"]} pistettä</p>
					<p>{this.state.usersBestGame["gameDifficulty"]}-tason {this.state.usersBestGame["gamemode"]}</p>
					<p>{this.state.usersBestGame["timeStamp"]}</p>
				</div>
			)
		}
	}

	render() {
		console.log(this.state.usersBestGame)
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
				<Link to={this.state.goBackTo}>
					<button className="gobackbutton">Takaisin</button>
				</Link>
				<font size="4"><div>
					<h2>Käyttäjä {this.state.viewedUserName}</h2>
					<p>Sähköposti: {this.state.viewedUserEmail}</p>
					<p>Pelattuja pelejä: {this.state.totalGames.length}</p>
					<br></br>
					{this.bestGame()}
				</div>
				</font>
			</div >
		)
	}
}

export default User
