import React from 'react'
import { Link } from 'react-router-dom'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { gameModeChangedToFalse, setAnswer, setImagesToMultipleChoiceGame, startGameClock, stopGameClock } from '../reducers/gameReducer'
import { setMessage } from '../reducers/messageReducer'
import { setScoreFlash } from '../reducers/scoreFlashReducer'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import emoji from 'node-emoji'
import { setAnswerSound } from '../reducers/soundReducer'

/**
 * MultipleChoiceGame (run under Gameloop.js) is one of game mode of Luupeli.
 * In MultipleChoiceGame, the player sees the picture and four names of the different bones. 
 * The player needs to click on the correct bone name.
 */
class MultipleChoiceGame extends React.Component {

  constructor(props) {
    super(props);
    this.timer = 0;
    this.state = {
      value: undefined,
      streakMCG: 0,
      bonus: 1.0,
      internalStartedAt: new Date().getTime
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    window.onunload = function () { window.location.href = '/' }

  }

  /**
   * Extra care is taken here to ensure that the quiz images are refreshed only when the questionnaire is transiting from one question to next.
   * Should the component mount freely (without the confusing if-else-logic), the result would be that each time the window is resized in order
   * to switch the game ui layout between horizontal/vertical, the question and the timer would be reset. This would pretty much amount to cheating,
   * as you could just keep resizing the window until you get a question you know for certain.
   * 
   * There would absolutely be a 'better' way to circumvent this problem, but that would possibly require major refactoring with the way a 
   * multiplechoice/imagemultiplechoice games are initialized and the subsequent questions served. This is an ugly hack, but hopefully it 
   * works reasonably well...
   * 
   */
  componentDidMount() {
    if (this.props.game.gameModeChanged) {
      this.props.setImagesToMultipleChoiceGame(this.props.game.images, this.props.game.answers)
      this.props.startGameClock()
      this.props.gameModeChangedToFalse()
    }
    setInterval(() => {
      this.setState(() => {
        console.log('test')
        return { unseen: "does not display" }
      });
    }, 1000)

  }

  componentDidUpdate(prevProps) {
    if (this.props.game.endCounter !== prevProps.game.endCounter) {
      this.props.setImagesToMultipleChoiceGame(this.props.game.images, this.props.game.answers)
      this.props.startGameClock()
      this.props.gameModeChangedToFalse()
    }
  }

  /**
 * As the player submits the answer, the points will be calculated, gameplay stats will be stored and player message will be generated.
 * @param {*} event 
 */
  handleSubmit(event) {
    this.props.stopGameClock()
    this.setState({ value: event.target.value })
    const correctness = this.checkCorrectness(event.target.value)
    this.props.setAnswerSound(correctness)

    let current = new Date().getTime()
    let started = this.props.game.startedAt
    if (started < 1 || isNaN(started) || started === undefined) {
      started = this.state.internalStartedAt
    }
    //let points = (Math.round((this.checkCorrectness(event.target.value) * Math.max(10, this.props.game.currentImage.bone.nameLatin.length)) * ((300 + Math.max(0, (300 - this.state.seconds))) / 600))) / 20
    let points = (Math.round((correctness * Math.min(10, this.props.game.currentImage.bone.nameLatin.length)) * ((30 + Math.max(0, (30 - ((current - started) / 1000)) / 60))))) / 80

    if (this.checkCorrectness(event.target.value) > 99) {
      points = points * 10
    }
    points = Math.round(points / 20) * 20

    if (this.checkCorrectness(event.target.value) < 70) {
      points = 0
    }

    let streakEmoji = require('node-emoji')
    streakEmoji = emoji.get('yellow_heart')
    let streakNote = ''
    let currentStreak = this.state.streakMCG
    let currentBonus = this.state.bonus
    let streakStyle = 'correct'

    if (correctness === 100) {
      this.setState({ streakMCG: currentStreak + 1, bonus: currentBonus + 0.5 })
      streakNote = currentBonus + 'x!'
    } else {
      points = 0
      streakStyle = 'incorrect'
      streakEmoji = require('node-emoji')
      streakEmoji = streakEmoji.get('poop')
      streakNote = ''
      this.setState({ streakMCG: 0, bonus: 1.0 })
    }

    let scoreFlashRowtext = '' + streakNote + '' + streakEmoji + '' + points + ' PTS!!!' + streakEmoji
    this.props.setScoreFlash(points, streakNote, streakEmoji, scoreFlashRowtext, streakStyle, 3, true)

    setTimeout(() => {
      this.props.setAnswer(this.props.game.currentImage, this.checkCorrectness(this.state.value), this.state.value, this.props.game.currentImage.animal.name, current - started, points)
      this.setState({ value: undefined })
    }, 3000)
  }

  /**
* This method returns 100 if the answer is correct and 0 if the answer is incorrect.
*/
  checkCorrectness(answer) {
    if (this.props.game.currentImage.bone.nameLatin.toLowerCase() === answer.toLowerCase()) {
      return 100
    } else {
      return 0
    }
  }

  /**
 * This method generates the buttons to be displayed. If the answer is correct, the selected button is green. 
 * If wrongly answered, the selected button is red and the correct answer is green.
*/
  style(choice) {
    if (choice.correct && choice.nameLatin === this.state.value) {
      return 'success'
    } else if (choice.correct === false && choice.nameLatin === this.state.value) {
      return 'danger'
    }
    if (choice.correct === true && undefined !== this.state.value && choice.nameLatin !== this.state.value) {
      return 'success'
    }
    return 'info'
  }

  render() {
    const imageWidth = () => {
      const windowWidth = Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
      )

      if (windowWidth > 400) {
        return 600
      }
      return windowWidth - 40
    }

    const debug = () => {
      if (process.env.NODE_ENV === 'development') {
        return (
          <p>Oikea vastaus: {this.props.game.currentImage.bone.nameLatin}</p>
        )
      }
      return null
    }

    const houseEmoji = emoji.get('house')

    return (
      <div className="bottom">
        <div className="row" id="image-holder">
          <div className="intro">
            <CloudinaryContext cloudName="luupeli">
              <div className="height-restricted">
                <Image publicId={this.props.game.currentImage.url}>
                  <Transformation width={imageWidth()} />
                </Image>
              </div>
            </CloudinaryContext>
          </div>
        </div>
        <div>
          {this.props.game.wrongAnswerOptions.map(choice => <Button bsStyle={this.style(choice)} disabled={undefined !== this.state.value} value={choice.nameLatin} onClick={this.handleSubmit}>{choice.nameLatin}</Button>)}
          {debug()}
        </div>
        <div className="homeicon">
          <Link to='/'>
            <p>{houseEmoji}</p><p>Lopeta</p>
          </Link>
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
  setAnswer,
  setImagesToMultipleChoiceGame,
  setMessage,
  setScoreFlash,
  startGameClock,
  stopGameClock,
  setAnswerSound,
  gameModeChangedToFalse
}

const ConnectedMultipleChoiceGame = connect(
  mapStateToProps,
  mapDispatchToProps
)(MultipleChoiceGame)
export default ConnectedMultipleChoiceGame
