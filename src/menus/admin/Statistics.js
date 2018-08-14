import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import gameSessionService from '../../services/gameSessions'
import gameSessions from '../../services/gameSessions';
import { DateRange } from 'react-date-range';

class Statistics extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			gameSessions: [],
			gameSessionsFiltered: [],
			timePlayed: 0.0,
			writingGameCount: 0,
			mixedGameCount: 0,
			multipleChoiceGameCount: 0,
			gamesByLoggedInUsers: 0
		}
		window.onunload = function () { window.location.href = '/' }
		this.setStats = this.setStats.bind(this)
		this.setTimePlayed = this.setTimePlayed.bind(this)
		this.setGameTypes = this.setGameModes.bind(this)
		this.setGamesPlayedByLoggedInUsers = this.setGamesPlayedByLoggedInUsers.bind(this)
		this.updateDate = this.updateDate.bind(this)
		this.secondsToHourMinuteSecond = this.secondsToHourMinuteSecond.bind(this)
	}

	updateDate(date){
		console.log(date)
		const end = date.endDate._d
		const endDateFormatted = ""
		console.log(end)
		let updatedGameSessions = this.state.gameSessions.filter(session => {
			return session.timeStamp <= date.endDate._d && session.timeStamp >= date.startDate._d
		})
		console.log(updatedGameSessions)
	}

	secondsToHourMinuteSecond(total) {
		var hours = Math.floor(total / 3600);
		var minutes = Math.floor(total % 3600 / 60);
		var seconds = Math.floor(total % 3600 % 60);
	
		var hourDisplay = hours > 0 ? hours + (hours == 1 ? " tunti, " : " tuntia, ") : "";
		var minuteDisplay = minutes > 0 ? minutes + (minutes == 1 ? " minuutti, " : " minuuttia, ") : "";
		var secondDisplay = seconds > 0 ? seconds + (seconds == 1 ? " sekuntti" : " sekuntia") : "";
		return hourDisplay + minuteDisplay + secondDisplay; 
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
		this.setState({ gameSessions: response.data, gameSessionsFiltered: response.data })
		this.setTimePlayed()
		this.setGameModes()
		this.setGamesPlayedByLoggedInUsers()
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
			return session.gamemode === "kirjoituspeli"
		}).length
		let mixedGame = this.state.gameSessionsFiltered.filter(session => {
			return session.gamemode === "sekapeli"
		}).length
		let multipleChoiceGame = this.state.gameSessionsFiltered.filter(session => {
			return session.gamemode === "monivalintapeli"
		}).length
		this.setState({ writingGameCount: writingGame , 
							mixedGameCount: mixedGame , 
							multipleChoiceGameCount: multipleChoiceGame })
	}

	setGamesPlayedByLoggedInUsers() {
		let gamesByLoggedInUsers = this.state.gameSessionsFiltered.filter(session => {
			return session.user !== null
		}).length
		this.setState({ gamesByLoggedInUsers })
	}

	statsJSX() {
		if (this.state.gameSessionsFiltered.length === 0) {
			return (
				<p>Ladataan tietoja..</p>
			)
		} else {
			return (
				<div>
					<p>Pelejä pelattu kirjautuneiden käyttäjien osalta: {this.state.gamesByLoggedInUsers} kpl </p>
					<p>Pelejä pelattu anonyymien käyttäjien osalta: {this.state.gameSessionsFiltered.length - 
																	this.state.gamesByLoggedInUsers} kpl </p>
					<p>Pelejä pelattu yhteensä: {this.state.gameSessionsFiltered.length} kpl</p>
					<p>Kirjoituspelejä pelattu: {this.state.writingGameCount} kpl</p>
					<p>Monivalintapelejä pelattu: {this.state.multipleChoiceGameCount} kpl</p>
					<p>Sekapelejä pelattu: {this.state.mixedGameCount} kpl</p>
					<p>Peliä pelattu yhteensä: {this.secondsToHourMinuteSecond(this.state.timePlayed)}</p>
				</div>
			)
		}
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

				<div className="App menu">
				<DateRange
					maxDate={Date.now()}
					onChange={this.updateDate}
				/>
				</div>
				<h2>Pelin statistiikka</h2>
				{this.statsJSX()}
			</div>
		)
	}
}

export default Statistics
