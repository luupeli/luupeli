
import React from 'react'
import { connect } from 'react-redux'
import { ProgressBar } from 'react-bootstrap'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { Animated } from "react-animated-css";

class ScoreBoard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			seconds: 0,
			score: 0,
			previousImage: '',
			endCounterAtPreviousImage: 999,
			previousUrl: 'none'
		}

		this.reminderOfPreviousImage = this.reminderOfPreviousImage.bind(this)
	};

	/**
	* Here we increase the game's internal clock by one unit each tick. 
	* "seconds" refers to the time spent answering the current question, while
	* "secondsTotal" refers to the total time spent answering all the questions so far.
	* 
	* The tick is currently set at 100 milliseconds meaning that 1 actual second is actually 10 tick-seconds.
	* This is done simply to make the time-based scoring feel more granular.
	*/
	tick() {
		let started=this.props.game.startedAt
		let current= new Date().getTime()
		if (started===undefined) {started=current}
		
		

		// if (current-started<2000 && (this.state.previousImage === '' || this.state.previousImage.bone===undefined)) {
		// 	console.log('vanha image: '+this.state.previousImage.bone.nameLatin)
		// 	this.setState({ seconds: this.getElapsedTime(), score: this.scoreToShow(), previousImage: this.props.game.currentImage })
		// 	console.log('korvataan...: '+this.state.previousImage.bone.nameLatin)
		// }

		let currentBoneName= this.props.game.currentImage.bone.nameLatin
		let previousBoneName='___'
		if (this.state.previousImage.bone!==undefined) {
			previousBoneName=this.state.previousImage.bone.nameLatin
		}
		
		console.log('current: '+current+", started: "+started+", names: "+currentBoneName+" (c) vs "+previousBoneName+" (p)")
		 if (this.state.endCounterAtPreviousImage>this.props.game.endCounter && currentBoneName!==previousBoneName) {//this.props.game.currentImage.url !== this.state.previousImage.url) {
			//console.log('II vanha image: '+this.state.previousImage.bone.nameLatin)
			this.setState({ seconds: this.getElapsedTime(), score: this.scoreToShow(), previousImage: this.props.game.currentImage,endCounterAtPreviousImage:this.props.game.endCounter-1 })
			console.log('II korvataan...: '+this.state.previousImage.bone.nameLatin)
		} else {
			this.setState({ seconds: this.getElapsedTime(), score: this.scoreToShow() });
		}
	}

	
	componentDidMount() {
		setInterval(() => {
		  this.setState(() => {
			console.log('test')
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
	// 	if (this.state.score!==scoreShown) {
	// 		setInterval(() => {
	// 			this.setState(() => {
	// 		this.setState({score: scoreShown})
	// 	});
	// }, 100);
	// 	}
		return scoreShown
	}

	// componentDidMount() {
	// 	setInterval(() => {
	// 		this.setState(() => {
	// 			// console.log('test')
	// 			return { unseen: "does not display" }
	// 		});
	// 	}, 1000);
	// 	}

	/**
	 * With the component mounting, the game time measuring tick() is set at 50 milliseconds.
	 */
	// componentWillMount() {

	// 	this.interval = setInterval(() => this.tick(), 1000);
	// }
	/**
	 * At component unmount the interval needs to be cleared.
	 */
	componentWillUnmount() {
		clearInterval(this.interval);
	}


	/**
		* Method for rendering the Gameloop page header (containing ProgressBar)
		*/
	render() {
		let started=this.props.game.startedAt
		let current= new Date().getTime()
		if (isNaN(started) && this.state.seconds===0) {
			this.setState({seconds: current,previousImage: this.props.game.currentImage,endCounterAtPreviousImage:this.props.game.endCounter-1})
		} 

		else if (this.state.endCounterAtPreviousImage>this.props.game.endCounter && this.props.game.currentImage.url!==this.state.previousImage.url) {
			this.setState({seconds: current,previousImage: this.props.game.currentImage,endCounterAtPreviousImage:this.props.game.endCounter-1})
		}

		if (isNaN(started)) {
			started=this.state.seconds
		}
		
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
					<h5>TIME {Math.round((current-started)/1000)}</h5>
					{this.reminderOfPreviousImage(this.props.progressWidth)}
				</div>
			</div>
		)
	}

	reminderOfPreviousImage(progressWidth) {

		let started=this.props.game.startedAt
		let current= new Date().getTime()
		

		if (!this.props.mobileLayout && this.state.previousImage !== null && this.state.previousImage !== '' && this.props.game.gamemode === 'kirjoituspeli' && this.props.game.endCounter < this.props.game.gameLength) {
			if (this.state.previousImage.bone.nameLatin !== this.props.game.currentImage.bone.nameLatin || this.state.previousImage.bone.nameLatin === this.props.game.currentImage.bone.nameLatin) {
				let animationActive = false
				if (current-started>5000) {
					animationActive = true
				}

				return (
					<div className="reminder-of-previous-answer">
						<Animated animationIn="fadeIn" animationOut="fadeOut faster" animationInDelay="100" animationOutDelay="100" isVisible={animationActive}>
							<h5>EDELLINEN</h5>
							<h6>{this.state.previousImage.bone.nameLatin}</h6>
						</Animated>
						<div className="intro">
							<CloudinaryContext cloudName="luupeli">
								<div className="height-restricted" >
									<Animated animat3="fadeIn" animationOut="fadeOut faster" animationInDelaya="100" animationOutDelay="100" isVisible={animationActive}>
										<Image id="bone-image" publicId={this.state.previousImage.url}>

											<Transformation width="250" height="150" crop="scale" effect="grayscale" />

										</Image>
									</Animated>
								</div>
							</CloudinaryContext>

						</div>
					</div>
				)
			}
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
