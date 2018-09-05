
import React from 'react'
import { connect } from 'react-redux'
import { ProgressBar } from 'react-bootstrap'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { Animated } from "react-animated-css";

class ScoreBoard extends React.Component {

	constructor(props) {
		super(props);
		this.reminderOfPreviousImage = this.reminderOfPreviousImage.bind(this)
	}

	componentDidMount() {
		setInterval(() => {
			this.setState(() => {
			//	console.log('test')
				return { unseen: "does not display" }
			});
		}, 150);
	}

	getElapsedTime() {
		let stoppedAt
		if (this.props.game.stoppedAt === undefined) {
			stoppedAt = new Date().getTime()
		} else {
			stoppedAt = this.props.game.stoppedAt
		}
		if (!this.props.game.startedAt) {
			return 0;
		} else {
			return Math.round((stoppedAt - this.props.game.startedAt) / 1000);
		}
	}

	scoreToShow() {
		let scoreActual = this.props.scoreflash.score
		const durationOfScoreRise = Math.min(30, (scoreActual / 10) + 5)
		if (!this.props.scoreflash.visibility) {
			scoreActual = 0
		}
		let scoreShown = this.props.game.totalScore
		if (this.props.game.scoreflash !== undefined) {
			scoreShown =
				this.props.game.totalScore + Math.min(scoreActual, Math.round(scoreActual * ((new Date().getTime() - this.props.game.scoreflash.startTime) / (50 * durationOfScoreRise))))
		}

		return scoreShown
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	/**
		* Method for rendering the Gameloop page header (containing ProgressBar)
		*/
	render() {
		let progressBar = <ProgressBar bsStyle="info" bsClass="progress-bar-slim progress-bar" now={0} key={0} />
		let correctAnswers = []
		if (this.props.game.answers !== undefined) {
			correctAnswers = this.props.game.answers.filter(ans => ans.correctness === 100)

			progressBar = this.props.game.answers.map((ans, i) => {
				if (ans.correctness === 100) {
					return <div class="progress-bar progress-bar-slim progress-bar-success progress-bar-striped active" style={{ width: ((1 / this.props.game.gameLength) * 100) + "%" }} role="progressbar" aria-valuenow={(1 / this.props.game.gameLength) * 100} aria-valuemin="0" aria-valuemax="100" key={i}></div>
				} else if (ans.correctness > 70 && ans.correctness < 100) {
					return <div class="progress-bar progress-bar-slim progress-bar-warning progress-bar-striped active" style={{ width: ((1 / this.props.game.gameLength) * 100) + "%" }} role="progressbar" aria-valuenow={(1 / this.props.game.gameLength) * 100} aria-valuemin="0" aria-valuemax="100" key={i}></div>
				} else {
					return <div class="progress-bar progress-bar-slim progress-bar-danger progress-bar-striped active" style={{ width: ((1 / this.props.game.gameLength) * 100) + "%" }} role="progressbar" aria-valuenow={(1 / this.props.game.gameLength) * 100} aria-valuemin="0" aria-valuemax="100" key={i}></div>
				}
			})
		}

		return (
			<div>
				<div className="score-board">
					{/* <div className="col-md-6 col-md-offset-3 center-block"> */}
					<h3>{correctAnswers.length}/{this.props.game.gameLength}</h3>
					<div class="progress progress-slim">
						{progressBar}
					</div>
					{/* </div> */}
				</div>
				<div className="score-board">
					<h3>SCORE {this.scoreToShow()}</h3>
					<h5>TIME {this.getElapsedTime()}</h5>
					{this.reminderOfPreviousImage()}
				</div>
			</div>
		)
	}

	reminderOfPreviousImage() {
		let prevImage = undefined
		if (this.props.game.answers === undefined) {
			prevImage = undefined
		} else {
			prevImage = this.props.game.answers[this.props.game.answers.length - 1].image
		}

		if (!this.props.mobileLayout && prevImage !== undefined && !this.props.scoreflash.visibility) {

			return (
				<div className="reminder-of-previous-answer">
					<Animated animationIn="fadeIn" animationOut="fadeOut faster" animationInDelay="500" animationOutDelay="0">
						<h5>EDELLINEN</h5>
						<h6>{prevImage.bone.nameLatin}</h6>
					</Animated>
					<div className="intro">
						<CloudinaryContext cloudName="luupeli">
							<div className="height-restricted" >
								<Animated animationIn="fadeIn" animationInDelay="500" animationOutDelay="0">
									<Image id="bone-image" publicId={prevImage.url}>

										<Transformation width="250" height="150" crop="scale" effect="grayscale" />

									</Image>
								</Animated>
							</div>
						</CloudinaryContext>

					</div>
				</div>
			)
		}

		return null

	}
}

const mapStateToProps = (state) => {
	return {
		game: state.game,
		scoreflash: state.scoreflash
	}
}

const ConnectedScoreBoard = connect(
	mapStateToProps,
	null
)(ScoreBoard)
export default ConnectedScoreBoard
