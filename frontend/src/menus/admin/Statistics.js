import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import gameSessionService from '../../services/gameSessions'
import imageService from '../../services/images'
import answersService from '../../services/answers'
import { DateRange } from 'react-date-range';
import Moment from 'moment';
import { Row, Col } from 'react-bootstrap'
import getUrl from '../../services/urls'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'

//Statistics-page shows stats about the game to the admin, like how many games have been played.
class Statistics extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loaded: false,
			gameSessions: [],
			gameSessionsFiltered: [],
			allImages: [],
			top10EasiestImages: [],
			top10HardestImages: [],
			timePlayed: 0.0,
			writingGameCount: 0,
			mixedGameCount: 0,
			multipleChoiceGameCount: 0,
			gamesByLoggedInUsers: 0,
			gamesByAnonymousUsers: 0,
			timeMessage: 'Päivät kaikilta ajoilta'
		}
		window.onunload = function () { window.location.href = '/' }
		this.setInitialStats = this.setInitialStats.bind(this)
		this.setStats = this.setStats.bind(this)
		this.setTimePlayed = this.setTimePlayed.bind(this)
		this.setGameTypes = this.setGameModes.bind(this)
    this.setGamesPlayedByLoggedInUsers = this.setGamesPlayedByLoggedInUsers.bind(this)
    this.setImages = this.setImages.bind(this)
		this.updateDate = this.updateDate.bind(this)
		this.secondsToHourMinuteSecond = this.secondsToHourMinuteSecond.bind(this)
	}

	// Checks if the user is admin, and loads initial data to state. 
	// If not admin then redirects to index.
  componentDidMount() {
		const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			if (user.role !== "ADMIN") {
				this.setState({ redirect: true, redirectTo: '/' })
			}
      this.setState({ user })
      
      imageService.getAll()
        .then((response) => {
          this.setImages(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
      
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
	// Removes images from getted images that haven't been guessed.
	// Then the method orders them on ascending order by difficulty, and places top 10 hardest/easiest images on state.
  setImages(images) {
    var filteredImages = images.filter(function(image) {
        console.log(image.correctness)
        return image.correctness !== undefined
    })
    filteredImages.sort((a, b) => (a.correctness / a.attempts) - (b.correctness / b.attempts))
    this.setState({ allImages : filteredImages })

    const top10EasiestImages = filteredImages.slice(filteredImages.length - 10)
    this.setState({ top10EasiestImages })

    var top10HardestImages = filteredImages.slice(0, 10)
    top10HardestImages.sort((a, b) => (a.correctness / a.attempts) - (b.correctness - b.attempts))
    
    this.setState({ top10HardestImages })
  }

	// When two calendar dates aren't equal (two dates are chosen), the method will show statistics between those two dates
	updateDate(date) {
		console.log(date)
		const firstDate = Moment(date.startDate._d).format('YYYY MM DD')
		const lastDate = Moment(date.endDate._d).format('YYYY MM DD')
		console.log(startDate)

		var startDate = firstDate
		var endDate = lastDate

		if (firstDate === lastDate) {
			startDate = '2018 01 01'
			endDate = '2048 01 01'
		}

		const updatedGameSessions = this.state.gameSessions.filter(session => {
			var sessionTimeStamp = Moment(session.timeStamp).format('YYYY MM DD')
			return endDate >= sessionTimeStamp && startDate <= sessionTimeStamp
		})

		console.log(updatedGameSessions)
		this.setState({ gameSessionsFiltered: updatedGameSessions })

		const timeMessage = (firstDate === lastDate) ? 'Päivät kaikilta ajoilta' : Moment((date.startDate._d)).format('DD MM YYYY') + ' - ' + Moment(date.endDate._d).format('DD MM YYYY')
		this.setState({ timeMessage })
		console.log(this.state.gameSessionsFiltered)
		this.setStats(updatedGameSessions)
		
	}

	// Formats the time to a string that looks decent
	secondsToHourMinuteSecond(total) {
		var hours = Math.floor(total / 3600 / 60);
		var minutes = Math.floor(total % 3600 / 60);
		var seconds = Math.floor(total % 3600 % 60);
		var hourDisplay = hours > 0 ? hours + (hours === 1 ? " tunti, " : " tuntia, ") : "";
		var minuteDisplay = minutes > 0 ? minutes + (minutes === 1 ? " minuutti, " : " minuuttia, ") : "";
		var secondDisplay = seconds > 0 ? seconds + (seconds === 1 ? " sekuntti" : " sekuntia") : "";
		return hourDisplay + minuteDisplay + secondDisplay;
	}

	// When called from componentDidMount the method will put initial data from response to state and calls setStats
	// which handles the data even further. After that "loaded" becomes true, which sends removes the loading-message
	// from view
	setInitialStats(response) {			
		this.setState({ gameSessions: response.data, gameSessionsFiltered: response.data })
    this.setStats(response.data)
    this.setState({ loaded: true })
	}

	// Calls different methods which handles data. updatedGameSessions is either all data if called from setInitialStats
	// or it's data that's been filtered via calendar timestamps if called from updateDate
	setStats(updatedGameSessions) {
		this.setTimePlayed(updatedGameSessions)
		this.setGameModes(updatedGameSessions)
    this.setGamesPlayedByLoggedInUsers(updatedGameSessions)
}

	// Sets the total time played in seconds from all game sessions.
	setTimePlayed(updatedGameSessions) {
		let seconds = 0
		updatedGameSessions.forEach(function (session) {
			seconds += session.seconds
		})
		const timePlayed = Math.round(seconds)
		this.setState({ timePlayed })
	}

	// Sets the count on how many games on each game mode has been played
	setGameModes(updatedGameSessions) {
		let writingGame = updatedGameSessions.filter(session => {
			return session.gamemode === "kirjoituspeli"
		}).length
		let mixedGame = updatedGameSessions.filter(session => {
			return session.gamemode === "sekapeli"
		}).length
		let multipleChoiceGame = updatedGameSessions.filter(session => {
			return session.gamemode === "monivalintapeli"
		}).length
		this.setState({
			writingGameCount: writingGame,
			mixedGameCount: mixedGame,
			multipleChoiceGameCount: multipleChoiceGame
		})
	}

	// Sets the count on games played by logged in users and anonymous users.
	setGamesPlayedByLoggedInUsers(updatedGameSessions) {
		let gamesByLoggedInUsers = updatedGameSessions.filter(session => {
			return session.user !== null
		}).length
		this.setState({ gamesByLoggedInUsers })
		let gamesByAnonymousUsers = updatedGameSessions.length - gamesByLoggedInUsers
		this.setState({ gamesByAnonymousUsers })
	}

	//returns stats or an informative message
	statsJSX() {

		if (this.state.gameSessionsFiltered.length === 0) {
			if (!this.state.loaded) {
				return (
					<p>Ladataan tietoja..</p>
				)
			} else {
				return (
					<p>Pelejä ei löytynyt valitulla aikavälillä!</p>
				)
			}
		} else {
			return (
				<div>
					<div>
            <p>{this.state.timeMessage}</p>
						<p>Pelejä pelattu kirjautuneiden käyttäjien osalta: {this.state.gamesByLoggedInUsers} kpl </p>
						<p>Pelejä pelattu anonyymien käyttäjien osalta: {this.state.gamesByAnonymousUsers} kpl </p>
						<p>Pelejä pelattu yhteensä: {this.state.gameSessionsFiltered.length} kpl</p>
						<p>Kirjoituspelejä pelattu: {this.state.writingGameCount} kpl</p>
						<p>Monivalintapelejä pelattu: {this.state.multipleChoiceGameCount} kpl</p>
						<p>Sekapelejä pelattu: {this.state.mixedGameCount} kpl</p>
						<p>Peliä pelattu yhteensä: {this.secondsToHourMinuteSecond(this.state.timePlayed)}</p>
					</div>
					<div>
            <h4>Helpoimmat kuvat top 10</h4>
						{this.state.top10EasiestImages.map((image, idx) => {
							console.log(image.url)
							return (
							<div key={image.id} id={"bone" + idx}> 
								<p>{image.bone.nameLatin}, {image.animal.name}</p>
								<small>Vastattu: {image.attempts} kertaa || </small>
								<small>Täysin oikein: {image.correctAttempts} kertaa || </small>
								<small>Oikeellisuuskeskiarvo: {Math.round(image.correctness / image.attempts)}</small>
								
								<CloudinaryContext cloudName="luupeli">
									<Image publicId={image.url}>
										{/* <Transformation width='300' crop='fill' /> */}
									</Image>
								</CloudinaryContext>
							</div>
							)
						})}
            <h4>Vaikeimmat kuvat top 10</h4>
						{this.state.top10HardestImages.map((image, idx) => {
							console.log(image.url)
							return (
							<div key={image.id} id={"bone" + idx}> 
								<p>{image.bone.nameLatin}, {image.animal.name}</p>
								<small>Vastattu: {image.attempts} kertaa || </small>
								<small>Täysin oikein: {image.correctAttempts} kertaa || 	</small>
								<small>Oikeellisuuskeskiarvo: {Math.round(image.correctness / image.attempts)}</small>
								<CloudinaryContext cloudName="luupeli">
									<Image publicId={image.url}>
										{/* <Transformation width='300' crop='fill' /> */}
									</Image>
								</CloudinaryContext>
							</div>
							)
						})}
					</div>
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
				<div id='gameStatistics'>
					{this.statsJSX()}
				</div>
			</div>
		)
	}
}

export default Statistics