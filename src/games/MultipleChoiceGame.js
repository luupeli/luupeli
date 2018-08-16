import React from 'react'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { setAnswer, setImagesToMultipleChoiceGame, startGameClock, stopGameClock } from '../reducers/gameReducer'
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
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    window.onunload = function () { window.location.href = '/' }

  }

  componentDidMount() {
    this.props.setImagesToMultipleChoiceGame(this.props.game.images, this.props.game.answers)
    this.props.startGameClock()
  }

  componentDidUpdate(prevProps) {
    if (this.props.game.endCounter !== prevProps.game.endCounter) {
      this.props.setImagesToMultipleChoiceGame(this.props.game.images, this.props.game.answers)
      this.props.startGameClock()
    }
  }

  /**
 * As the player submits the answer, the points will be calculated, gameplay stats will be stored and player message will be generated.
 * @param {*} event 
 */
  handleSubmit(event) {
    event.preventDefault()
    this.props.stopGameClock()
    this.setState({ value: event.target.value })
    const correctness = this.checkCorrectness(event.target.value)
    this.props.setAnswerSound(correctness)

    let gameClock = Math.round(((new Date).getTime() - this.props.game.startTime) / 50)
    //let points = (Math.round((this.checkCorrectness(event.target.value) * Math.max(10, this.props.game.currentImage.bone.nameLatin.length)) * ((300 + Math.max(0, (300 - this.state.seconds))) / 600))) / 20
    let points = Math.round((1000 + ((1000 + Math.max(0, (400 - gameClock))) / 800))) / 20

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

    points = 1000;
    if (correctness === 100) {
      this.setState({ streakMCG: currentStreak + 1, bonus: currentBonus + 0.5 })
      streakNote = currentBonus + 'x!'
    } else {
      points = 0
      streakEmoji = require('node-emoji')
      streakEmoji = streakEmoji.get('poop')
      streakNote = ''
      this.setState({ streakMCG: 0, bonus: 1.0 })
    }

    let scoreFlashRowtext = '' + streakNote + '' + streakEmoji + '' + points + ' PTS!!!' + streakEmoji
    this.props.setScoreFlash(points, streakNote, streakEmoji, scoreFlashRowtext, 'success', 3, true)

    setTimeout(() => {
      this.props.setAnswer(this.props.game.currentImage, this.checkCorrectness(this.state.value), this.state.value, this.props.game.gameClock, points)
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

    return (
      <div className="bottom">
        <div className="row" id="image-holder">
          <div className="intro">
            <CloudinaryContext cloudName="luupeli">
              <div className="height-restricted">
                <Image publicId={this.props.game.currentImage.url + ".png"}>
                  <Transformation width={imageWidth()} format="png" crop="fill" radius="20" />
                </Image>
              </div>
            </CloudinaryContext>
          </div>
        </div>
        <div className="row">
        </div>
        <div className="container">
          <div className="intro" />
          {this.props.game.wrongAnswerOptions.map(choice => <Button bsStyle={this.style(choice)} disabled={undefined !== this.state.value} value={choice.nameLatin} onClick={this.handleSubmit}>{choice.nameLatin}</Button>)}
       {/*   <p>Oikea vastaus: {this.props.game.currentImage.bone.nameLatin}</p> */}
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
  setAnswerSound
}

const ConnectedMultipleChoiceGame = connect(
  mapStateToProps,
  mapDispatchToProps
)(MultipleChoiceGame)
export default ConnectedMultipleChoiceGame