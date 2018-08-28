import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { Grid, Row, Col } from 'react-bootstrap'
import emoji from 'node-emoji'
import { gameInitialization } from '../../reducers/gameReducer'
import { ProgressBar } from 'react-bootstrap'
import Sound from 'react-sound'
import BackButton from '../BackButton'
import userStatistics from '../../services/userStatistics'
import achievement from '../../menus/Achievement'
import { Animated } from 'react-animated-css'

/**
 * EndScreen is the game over/results screen of Luupeli.
 * Besides the actual score, the player should also receive some feedback on what has been learned.
 * The answers are classified as being either correct, almost correct (bad syntax, but close enough) or incorrect. 
 * 
 * This class is still very much work-in-progress, as the results are not yet integrated into the database (persistent player-based stats)
 */

class EndScreen extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			allStyles: JSON.parse(localStorage.getItem("allStyles")),
			styleIndex: localStorage.getItem('styleIndex'),
			style: localStorage.getItem('style'),
			user: null,
			redirect: false,
			localScore: -1,
			localGames: -1,
			scoreRetrieved: false
		}
		this.proceedToMain = this.proceedToMain.bind(this)
		this.proceedToGameModeSelection = this.proceedToGameModeSelection.bind(this)
		this.proceedToReplay = this.proceedToReplay.bind(this)
		window.onunload = function () { window.location.href = '/' }
	}

	componentDidMount() {
		const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			this.setState({ user })
		}
		console.log(this.props.game)
		console.log(this.props.game.gameLength)
	}

	proceedToMain(event) {
		this.setState({ redirect: true })
		this.setState({ redirectTo: '/' })
	}

	proceedToGameModeSelection(event) {
		this.setState({ redirect: true })
		this.setState({ redirectTo: '/gamemode' })
	}

	//Reinitialize a game with same settings as previous game played
	proceedToReplay(event) {
		this.props.gameInitialization(this.props.game.gameLength, this.props.game.images, this.props.game.user,
			this.props.game.gamemode, this.props.game.animals, this.props.game.bodyparts, this.props.game.playSound, this.props.game.gameDifficulty)
		this.setState({ redirect: true })
		this.setState({ redirectTo: '/game' })
	}

	retrieveScore() {
		if (!this.state.scoreRetrieved && this.state.user !== null) {

			userStatistics.getTotalGamesForIndividual(this.state.user.id)
				.then((response) => {
					this.setState({
						localGames: response.data.length, scoreRetrieved: true
					})
				})

			userStatistics.getTotalScore(this.state.user.id)
				.then((response) => {
					if (response.data.length !== 0) {
						this.setState({
							localScore: response.data
						})
					}
				})
		}

	}


	//Sorts answer array from most difficult to answer (for the player) to least difficult
	//First incorrect/almost correct answers sorted by correctness, then completely correct answers sorted by time spent answering
	sortByDifficulty(answers) {
		const compareCorrectness = (a, b) => {
			if (a.correctness < b.correctness) return -1
			if (a.correctness > b.correctness) return 1
			return 0
		}
		const compareTime = (a, b) => {
			if (a.seconds > b.seconds) return -1
			if (a.seconds < b.seconds) return 1
			return 0
		}

		console.log(answers)
		const incorrect = answers.filter(answer => answer.correctness < 100).sort(compareCorrectness)
		console.log(incorrect)
		const correct = answers.filter(answer => answer.correctness === 100).sort(compareTime)
		console.log(correct)
		incorrect.push.apply(incorrect, correct)
		return incorrect
	}

	//Render a column with one answer
	//Render emoji overlays dependant on correctness
	//heavy_check_mark 100% correct, negative_squared_cross_mark on incorrect, heavy_exclamation_mark on anything inbetween
	renderSingleAnswer(answer) {
		const imageWidth = () => {
			const windowWidth = Math.max(
				document.body.scrollWidth,
				document.documentElement.scrollWidth,
				document.body.offsetWidth,
				document.documentElement.offsetWidth,
				document.documentElement.clientWidth
			)
			return Math.floor(windowWidth / 5)
		}

		var gradeMark = ""
		var gradeMarkClass = ""

		if (answer.correctness === 100) {
			gradeMark = emoji.get('heavy_check_mark')
			gradeMarkClass = "grade-mark-good"
		} else if (answer.correctness > 70) {
			gradeMark = emoji.get('heavy_exclamation_mark')
			gradeMarkClass = "grade-mark-okay"
		} else {
			gradeMark = emoji.get('negative_squared_cross_mark')
			gradeMarkClass = "grade-mark-bad"
		}

		const correctAnswer = () => {
			if (this.props.game.gameDifficulty === 'hard') {
				return (
					<p><b>{answer.image.bone.nameLatin}, {answer.image.animal.name}</b></p>
				)
			}

			return (
				<p><b>{answer.image.bone.nameLatin}</b></p>
			)
		}

		const playerAnswer = () => {
			if (this.props.game.gameDifficulty === 'hard' && answer.animal !== 'none') {
				return (
					<p>Vastasit: {answer.answer}, {answer.animal}</p>
				)
			}

			return (
				<p>Vastasit: {answer.answer}</p>
			)
		}



		return (
			<Col xs={12} md={6} lg={6}>
				<Row className="show-grid row-eq-height">
					<Col xs={6} md={6} lg={6}>
						<CloudinaryContext cloudName="luupeli">
							<Image publicId={answer.image.url + ".png"}>
								<Transformation height={imageWidth()} crop="fill" />
							</Image>
						</CloudinaryContext>
					</Col>
					<Col xs={6} md={6} lg={6} bsClass="text-bg col">
						{correctAnswer()}
						{playerAnswer()}
						<p>Aika: {answer.seconds / 1000} s</p>
						<p>Pisteet: {answer.score}</p>
						<p className={gradeMarkClass}>{gradeMark}</p>
					</Col>
				</Row>
			</Col>
		)

	}

	//Render all answers as rows and cols
	//Answer array is split in half so that two answers can be rendered side-by-side
	renderAnswers() {

		const sortedAnswers = this.sortByDifficulty(this.props.game.answers)
		console.log(sortedAnswers)

		//Split answer array into halves so that when both halves are rendered side-by-side,
		//answers the player had most difficulty with are rendered near to the top of the page with easy answers at the bottom.
		const firstHalf = sortedAnswers.filter((answer, i) => i % 2 === 0)
		const lastHalf = sortedAnswers.filter((answer, i) => i % 2 !== 0)

		return (
			<Grid fluid={true}>
				{firstHalf.map((answer, i) => {
					if (i < lastHalf.length) {
						return (
							<Row className="show-grid">
								{this.renderSingleAnswer(answer)}
								{this.renderSingleAnswer(lastHalf[i])}
							</Row>
						)
					}

					return (
						<Row className="show-grid">
							{this.renderSingleAnswer(answer)}
							<Col xs={12} md={6} lg={6}>
								<Row className="show-grid row-eq-height">
									<Col xs={6} md={6} lg={6}>
									</Col>
									<Col xs={6} md={6} lg={6} bsClass="text-bg col">
									</Col>
								</Row>
							</Col>
						</Row>
					)
				}
				)}
			</Grid>
		)
	}

	render() {
		let i = this.state.styleIndex

		if (this.state.redirect) {
			return (
				<Redirect to={{
					pathname: this.state.redirectTo,
				}} />
			)
		}

		const correctAnswers = this.props.game.answers.filter(ans => ans.correctness === 100)
		const almostCorrectAnswers = this.props.game.answers.filter(ans => ans.correctness > 70 && ans.correctness < 100)
		const wrongAnswers = this.props.game.answers.filter(ans => ans.correctness <= 70)
		console.log(correctAnswers)
		console.log(wrongAnswers)

		const correctPortion = Math.round((correctAnswers.length / this.props.game.answers.length) * 100)
		const almostCorrectPortion = Math.round((almostCorrectAnswers.length / this.props.game.answers.length) * 100)
		const wrongPortion = Math.round((wrongAnswers.length / this.props.game.answers.length) * 100)
		console.log(correctPortion)
		console.log(wrongPortion)
		console.log(this.props.game.answers.length)

		this.retrieveScore()

		let achievementLocked = 'Luo profiili kerätäksesi saavutuksia!'
		let achievementLockedRowTwo = ''
		let achievementUnlocked = ''

		let scoreNow = this.state.localScore
		let gamesNow = this.state.localGames
		let scoreBefore = scoreNow - this.props.game.totalScore

		let goal = 12500



		// let goal= 50000+Math.floor(50000*(Math.floor(scoreBefore/100000)))+Math.min(Math.floor(scoreBefore/50000)*50000,50000)
		// let nextUnlock=50000+Math.floor(50000*(Math.floor(scoreNow/100000)))+Math.min(Math.floor(scoreNow/50000)*50000,50000)

		// let index=Math.floor(Math.min(1,(Math.floor(scoreNow/50000)))+Math.floor(1*(Math.floor(scoreNow/100000))))

		goal = achievement.getGoal(scoreBefore, gamesNow - 1)
		let index = achievement.getIndex(scoreNow, gamesNow)
		let goalGames = achievement.getGames(scoreBefore, gamesNow - 1)

		if (this.state.user !== null) {
			if (scoreNow >= goal && gamesNow >= goalGames && (scoreBefore < goal || gamesNow - 1 < goalGames)) {
				goal = achievement.getGoal(scoreNow, gamesNow)
				achievementLocked='Sinulle on myönnetty uusi taitotaso: '+achievement.getRank(index)+'!'
				let unlockedStyle = this.state.allStyles[index].style
				if (unlockedStyle===undefined) {
					achievementUnlocked='Onneksi olkoon, saavutit prestiisitason '+index+'!!'
				} else {
					if (unlockedStyle===this.state.allStyles[index-1].style) {
						unlockedStyle=unlockedStyle+' II'
					}
					achievementUnlocked='Onneksi olkoon, avasit teeman '+unlockedStyle+'!!'
				}

				// achievementUnlocked = 'Avasit: ' + this.state.allStyles[Math.min(index, this.state.allStyles.length - 1)].style + ' (i:' + index + '),scr before:' + scoreBefore + ',goal: ' + goal + ',scrnow: ' + scoreNow + ' seur: ' + goal
			} else {
				let howManyGamesUntilNextAchievement = Math.max(0, goalGames - gamesNow)
				let howMuchScoreUntilNextAchievement = Math.max(0, goal - scoreNow)

				let styleCurrent = this.state.allStyles[index].style
				let styleNext = this.state.allStyles[index + 1].style

				if (styleCurrent === styleNext) {
					styleNext = styleNext + ' II'
				} else if (styleNext === undefined) {
					styleNext = '???'
				}

				let divider = ' ja '
				if (index < 3) { divider = ' tai ' }

				let suggestionAboutScore = 'Ansaitse ' + howMuchScoreUntilNextAchievement + ' pistettä lisää'
				let suggestionAboutGames = 'Pelaa vielä ' + howManyGamesUntilNextAchievement + ' luupeli'
				if (howManyGamesUntilNextAchievement > 1) {
					suggestionAboutGames = suggestionAboutGames + 'ä'
				}
				if (howManyGamesUntilNextAchievement < 1) {
					divider = ''
					suggestionAboutGames = ''
				}
				if (howMuchScoreUntilNextAchievement < 20) {
					divider = ''
					suggestionAboutScore = ''
				}
				achievementLocked = suggestionAboutScore + divider + suggestionAboutGames
				achievementLockedRowTwo = 'Avataksesi teeman ' + styleNext + '!'

				// achievementUnlocked = 'Ansaitse ' + Math.max(0, goal - scoreNow) + ' pistettä lisää ja pelaa yhteensä ' + Math.max(0, goalGames - gamesNow) + ' luupeliä seuraavaan saavutukseen (i:' + index + ')'
			}
		}

		return (
			<div className={this.state.allStyles[i].overlay}>
				<div className={this.state.allStyles[i].background}>
					<div className={this.state.allStyles[i].style}>
						<div className='Appbd'>
							<Sound
								url={"/sounds/" + this.state.allStyles[i].music}
								playStatus={Sound.status.PLAYING}
								// playFromPosition={0 /* in milliseconds */}
								onLoading={this.handleSongLoading}
								onPlaying={this.handleSongPlaying}
								onFinishedPlaying={this.handleSongFinishedPlaying}
								loop="true"
							/>
							<div className="transbox">
								<h2>Pelin kulku:</h2>
								<Row className="show-grid">
									<Col xs={12} md={6}>
										<h3>Pisteet yhteensä: {this.props.game.totalScore}</h3>
									</Col>
									<Col xs={12} md={6}>
										<h3>Pelin kesto: {this.props.game.totalSeconds / 1000} s</h3>
									</Col>
								</Row>
								<div className="btn-group-horizontal" role="group">
									<button type="button" className="btn btn-theme" onClick={this.proceedToReplay}>Pelaa uudestaan</button>
									<button type="button" className="btn btn-theme" onClick={this.proceedToGameModeSelection}>Pelimoodivalikkoon</button>
								</div>

								<Animated animationIn="zoomInDown slower" animationInDelay="500" animationOutDelay="100" isVisible={true}>
									<h3>{achievementUnlocked}</h3>
								</Animated>
								<h3>{achievementLocked}</h3>
								<h3>{achievementLockedRowTwo}</h3>
							</div>

							<div>

								<h3 id="endScreenTitle">Vastauksesi olivat:</h3>
								<div id="resultsText">
									<div class="progress progress-fat">
										<div class="progress-bar progress-bar-fat progress-bar-success" style={{ width: correctPortion + "%" }} role="progressbar" aria-valuenow={correctPortion} aria-valuemin="0" aria-valuemax="100">Täysin oikein {correctPortion}%</div>
										<div class="progress-bar progress-bar-fat progress-bar-warning" style={{ width: almostCorrectPortion + "%" }} role="progressbar" aria-valuenow={almostCorrectPortion} aria-valuemin="0" aria-valuemax="100">Melkein oikein {almostCorrectPortion}%</div>
										<div class="progress-bar progress-bar-fat progress-bar-danger" style={{ width: wrongPortion + "%" }} role="progressbar" aria-valuenow={wrongPortion} aria-valuemin="0" aria-valuemax="100">Väärin {wrongPortion}%</div>
									</div>
									{this.renderAnswers()}
								</div>
							</div>

							<BackButton redirectTo='/' />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		game: state.game
	}
}

const mapDispatchToProps = {
	gameInitialization
}

const ConnectedEndScreen = connect(
	mapStateToProps,
	mapDispatchToProps
)(EndScreen)
export default ConnectedEndScreen
