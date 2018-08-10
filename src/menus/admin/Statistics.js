import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import gameSessionService from '../../services/gameSessions'
import gameSessions from '../../services/gameSessions';

class Statistics extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			gameSessions: [],
			gameSessionsFiltered: [],
			timePlayed: 0.0,
			writingGameCount: 0,
			mixedGameCount: 0,
			multipleChoiceGameCount: 0
		}
		window.onunload = function () { window.location.href = '/' }
		this.setStats = this.setStats.bind(this)
		this.setTimePlayed = this.setTimePlayed.bind(this)
		this.setGameTypes = this.setGameModes.bind(this)

	}

	componentDidMount() {
		const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			if (user.role !== "ADMIN") {
				this.setState({ redirect: true, redirectTo: '/' })
			}
			this.setState({ user })
			gameSessionService.getAll()
				.then((response) => {
					this.setStats(response)
				})
				.catch((error) => {
					console.log(error)
				})
		} else {
			this.setState({ redirect: true, redirectTo: '/' })
		}
	}

	setStats(response) {
		this.setState({ gameSessions: response.data },
				{ gameSessionsFiltered: response.data })
		this.setTimePlayed()
		this.setGameModes()
	}

	setTimePlayed() {
		let seconds = 0
		this.state.gameSessionsFiltered.forEach(function(session){
			seconds += session.seconds
		})
		this.setState({ timePlayed : Math.round(seconds) })
	}

	setGameModes() {
		let writingGame = this.state.gameSessionsFiltered.filter(session => {
			return session.mode === "kirjoituspeli"
		}).length
		let mixedGame = this.state.gameSessionsFiltered.filter(session => {
			return session.mode === "sekapeli"
		}).length
		let multipleChoiceGame = this.state.gameSessionsFiltered.filter(session => {
			return session.mode === "monivalintapeli"
		}).length
		this.setState({ writingGameCount: writingGame }, 
					{ mixedGameCount: mixedGame }, 
					{ multipleChoiceGameCount: multipleChoiceGame })
	}

	render() {
		console.log(this.state.gameSessions)
		if (this.state.redirect) {
			return (
				<Redirect to={{
					pathname: this.state.redirectTo,
				}} />
			)
		}
		return (
			<div className="menu-background App">
				<Link to='/admin'>
					<button className="gobackbutton">Takaisin</button>
				</Link>
				<h2>Pelin statistiikka</h2>
				<p>Pelejä pelattu: {this.state.gameSessionsFiltered.length} kappaletta</p>
				<p>Peliä pelattu yhteensä: {this.state.timePlayed} sekuntia</p>
				<p>Kirjoituspelejä pelattu: {this.state.writingGameCount} kpl</p>
				<p>Monivalintapelejä pelattu: {this.state.multipleChoiceGameCount} kpl</p>
				<p>Sekapelejä pelattu: {this.state.mixedGameCount} kpl</p>
			</div>
		)
	}
}

export default Statistics
