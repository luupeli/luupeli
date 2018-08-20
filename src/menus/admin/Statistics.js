import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import gameSessionService from '../../services/gameSessions'
import gameSessions from '../../services/gameSessions';
import { DateRange } from 'react-date-range';
import Moment from 'moment';


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
		this.setInitialStats = this.setInitialStats.bind(this)
		this.setStats = this.setStats.bind(this)
		this.setTimePlayed = this.setTimePlayed.bind(this)
		this.setGameTypes = this.setGameModes.bind(this)
		this.setGamesPlayedByLoggedInUsers = this.setGamesPlayedByLoggedInUsers.bind(this)
		this.updateDate = this.updateDate.bind(this)
		this.secondsToHourMinuteSecond = this.secondsToHourMinuteSecond.bind(this)
	}

	updateDate(date){
		console.log(date)
		const startDate = Moment(date.startDate._d).format('YYYY MM DD')
		const endDate = Moment(date.endDate._d).format('YYYY MM DD')
		if (startDate !== endDate) {
			let updatedGameSessions = this.state.gameSessions.filter(session => {
				var sessionTimeStamp = Moment(session.timeStamp).format('YYYY MM DD')
				return endDate >= sessionTimeStamp && startDate <= sessionTimeStamp
				//return session.timeStamp <= date.endDate._d && session.timeStamp >= date.startDate._d
			})
			console.log(updatedGameSessions)
			this.setState({ gameSessionsFiltered : updatedGameSessions})
			this.setStats()
		}
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
					this.setInitialStats(response)
				})
				.catch((error) => {
					console.log(error)
				})
		} else {
			this.setState({ redirect: true, redirectTo: '/' })
		}
	}

	setInitialStats(response) {
		this.setState({ gameSessions: response.data, gameSessionsFiltered: response.data })
		this.setStats()
	}

	setStats() {
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

	//renders stats, or "ladataan tietoja" if they're not loaded yet
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
		Moment.locale('en');

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
