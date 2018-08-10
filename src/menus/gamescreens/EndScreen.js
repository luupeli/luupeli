import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Label } from 'react-bootstrap'
import emoji from 'node-emoji'
import { gameInitialization } from '../../reducers/gameReducer'
import { ProgressBar } from 'react-bootstrap'

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
      style: localStorage.getItem('style'),
      user: null,
      redirect: false
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
        this.props.game.gamemode, this.props.game.animals, this.props.game.bodyparts)
		this.setState({ redirect: true })
		this.setState({ redirectTo: '/game' })
	}
  
  //Sorts answer array from most difficult to answer (for the player) to least difficult
  //First incorrect/almost correct answers sorted by correctness, then completely correct answers sorted by time spent answering
  sortByDifficulty(answers) {
		const compareCorrectness = (a,b) => {
			if (a.correctness < b.correctness) return -1
			if (a.correctness > b.correctness) return 1
			return 0
		}
		const compareTime = (a,b) => {
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
		
		return(
			<Col xs={12} md={6}>
						<Row className="show-grid row-eq-height">
							<Col xs={6}>
								<CloudinaryContext cloudName="luupeli">
									<Image publicId={answer.image.url+".png"}>
										<Transformation height={imageWidth()} crop="fill" />
									</Image>
								</CloudinaryContext>
							</Col>
							<Col xs={6} bsClass="text-bg col">
								<p><b>{answer.image.bone.nameLatin}</b></p>
								<p>Vastasit: {answer.answer}</p>
								<p>Aika: {answer.seconds / 10} s</p>
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
		
		const imageWidth = () => {
			const windowWidth = Math.max(
				document.body.scrollWidth,
				document.documentElement.scrollWidth,
				document.body.offsetWidth,
				document.documentElement.offsetWidth,
				document.documentElement.clientWidth
			)
			if (windowWidth > 400) {
				return 300
			}
			return windowWidth - 100
		}
		
		const totalAnswers = this.props.game.answers.length
		
		const sortedAnswers = this.sortByDifficulty(this.props.game.answers)
		console.log(sortedAnswers)
		
		//Split answer array into halves so that when both halves are rendered side-by-side,
		//answers the player had most difficulty with are rendered near to the top of the page with easy answers at the bottom.
		const firstHalf = sortedAnswers.filter((answer, i) => i % 2 === 0)
		const lastHalf = sortedAnswers.filter((answer, i) => i % 2 !== 0)
		
		return(
			<Grid>
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
						<Col xs={12} md={6}>
							<Row className="show-grid row-eq-height">
								<Col xs={6}>
								</Col>
								<Col xs={6} bsClass="text-bg col">
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
    
    const correctPortion = (correctAnswers.length/this.props.game.answers.length) * 100
    const almostCorrectPortion = (almostCorrectAnswers.length/this.props.game.answers.length) * 100
    const wrongPortion = (wrongAnswers.length/this.props.game.answers.length) * 100

    return (
      <div className='Appbd menu-background'>
        <div>
					<div className="btn-group" role="group">
						<button type="button" className="btn btn-secondary" onClick={this.proceedToReplay}>Pelaa uudestaan</button>
						<button type="button" className="btn btn-secondary" onClick={this.proceedToGameModeSelection}>Pelimoodivalikkoon</button>
					</div>
					<h1>Pelin kulku:</h1>
          <h2>Pisteet yhteensä: {this.props.game.totalScore}</h2>
          <h2>Pelin kesto: {this.props.game.totalSeconds / 10} s</h2>
        </div>
        <div>
          <h1 className='h2' id="endScreenTitle">Vastauksesi olivat:</h1>
          <div id="resultsText">
            <ProgressBar label={`answerPortions`}>
							<ProgressBar bsStyle="success" now={correctPortion} label={`Täysin oikein ${Math.round(correctPortion)}%`} key={1} />
							<ProgressBar bsStyle="warning" now={almostCorrectPortion} label={`Melkein oikein ${Math.round(almostCorrectPortion)}%`} key={2} />
							<ProgressBar bsStyle="danger" now={wrongPortion} label={`Väärin ${Math.round(wrongPortion)}%`} key={3} />
            </ProgressBar>
            {this.renderAnswers()}
          </div>

        </div>
        <div>
          <button className='gobackbutton' onClick={this.proceedToMain}>Etusivulle</button>
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
