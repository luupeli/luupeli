import React from 'react'
import { Link } from 'react-router-dom'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { setNeedToChangeQuestionFalse, setAnswer, setImagesToImageMultipleChoiceGame, startGameClock, stopGameClock } from '../reducers/gameReducer'
import { setMessage } from '../reducers/messageReducer'
import { setScoreFlash } from '../reducers/scoreFlashReducer'
import { connect } from 'react-redux'
import emoji from 'node-emoji'
import { setAnswerSound } from '../reducers/soundReducer'
import { Grid, Row, Col } from 'react-bootstrap'

class ImageMultipleChoiceGame extends React.Component {

  constructor(props) {
    super(props);
    this.timer = 0
    this.state = {
      clickDisabled: false,
      selectedId: undefined,
      selectedImage: undefined,
      streakMCG: 0,
      bonus: 1.0,
      internalStartedAt: new Date().getTime
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.renderImages = this.renderImages.bind(this)
  }

  /**
  * Extra care is taken here to ensure that the quiz images are refreshed only when the questionnaire is transiting from one question to next.
  * Should the component mount freely (without the confusing if-else-logic), the result would be that each time the window is resized in order
  * to switch the game ui layout between horizontal/vertical, the question and the timer would be reset. This would pretty much amount to cheating,
  * as you could just keep resizing the window until you get a question you know for certain.
  * 
  * There would absolutely be a 'better' way to circumvent this problem, but that would possibly require major refactoring with the way a 
  * games are initialized and the subsequent questions served. This is an ugly hack, but hopefully it 
  * works reasonably well...
  * 
  */
  componentDidMount() {
    if (this.props.game.needToChangeQuestion) {
      this.props.setImagesToImageMultipleChoiceGame(this.props.game.images, this.props.game.answers, this.props.game.gameDifficulty)
      this.props.startGameClock()
      this.props.setNeedToChangeQuestionFalse()
    }
    setInterval(() => {
      this.setState(() => {
        return { unseen: "does not display" }
      });
    }, 1000)
  }

  componentDidUpdate(prevProps) {
    if (this.props.game.endCounter !== prevProps.game.endCounter) {
      this.props.setImagesToImageMultipleChoiceGame(this.props.game.images, this.props.game.answers, this.props.game.gameDifficulty)
      this.props.startGameClock()
      this.props.setNeedToChangeQuestionFalse()
    }
  }

  handleSubmit(image) {
    if (this.state.clickDisabled) {
      return
    }
    this.setState({ clickDisabled: true })

    this.props.stopGameClock()
    this.setState({
      selectedId: image.id,
      selectedImage: image
    })
    const correctness = this.checkCorrectness(image)
    this.props.setAnswerSound(correctness)
    let current = new Date().getTime()
    let started = this.props.game.startedAt
    if (started < 1 || isNaN(started) || started === undefined) {
      started = this.state.internalStartedAt
    }

    let points = (Math.round((this.checkCorrectness(image) * Math.min(10, this.props.game.currentImage.bone.nameLatin.length)) * ((30 + Math.max(0, (30 - ((current - started) / 1000)) / 60))))) / 80

    if (correctness > 99) {
      points = points * 10
    }
    points = Math.round(points / 20) * 20

    if (correctness < 70) {
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
    } else if (correctness === 50) {
      streakStyle = 'almostcorrect'
      streakNote = 'Luu oikein, eläin väärin'
    } else {
      streakStyle = 'incorrect'
      points = 0
      streakEmoji = require('node-emoji')
      streakEmoji = streakEmoji.get('poop')
      streakNote = ''
      this.setState({ streakMCG: 0, bonus: 1.0 })
    }


    let scoreFlashRowtext = '' + streakNote + '' + streakEmoji + '' + points + ' PTS!!!' + streakEmoji

    this.props.setScoreFlash(points, streakNote, streakEmoji, scoreFlashRowtext, streakStyle, 2.5, true)
    this.setState({ choices: [] })
    setTimeout(() => {
      this.props.setAnswer(this.props.game.currentImage, correctness, image.bone.nameLatin, image.animal.name, current - started, points)
      this.setState({ selectedId: undefined, selectedImage: undefined })
      this.setState({ clickDisabled: false })
    }, 3000)
  }

  checkCorrectness(image) {
    if (image.correct) {
      return 100
    } else if (image.bone.nameLatin === this.props.game.currentImage.bone.nameLatin) {
      return 50
    }
    return 0
  }

  style(choice) {
    if (choice.correct && choice.id === this.state.selectedId) {
      return {
        borderStyle: 'solid',
        borderWidth: 10,
        borderRadius: 20,
        borderColor: 'green'
      }
    } else if (choice.correct === false && choice.id === this.state.selectedId) {
      return {
        borderStyle: 'solid',
        borderWidth: 10,
        borderRadius: 20,
        borderColor: 'red'
      }
    }
    if (choice.correct && undefined !== this.state.selectedId && choice.id !== this.state.selectedId) {
      return {
        borderStyle: 'solid',
        borderWidth: 10,
        borderRadius: 20,
        borderColor: 'green'
      }
    }
    if (this.state.selectedId === undefined || (choice.id !== this.state.selectedId && !choice.correct)) {
      return {
        borderStyle: 'solid',
        borderRadius: 20,
        cursor: 'pointer'
      }
    }
  }

  renderImages() {
    return (
      <Grid fluid={true}>
        <Row>
          {this.props.game.wrongImageOptions.slice(0, 2).map(choice => {
            return (
              <Col xs={6}>
                <div className="multi-height-restricted">
                  <CloudinaryContext cloudName="luupeli">
                    <Image publicId={choice.url} onClick={() => this.handleSubmit(choice)} style={this.style(choice)}>
                      <Transformation background="#000000" height="250" width="350" crop="lpad" />
                    </Image>
                  </CloudinaryContext>
                </div>
              </Col>
            )
          })}
        </Row>

        <Row className="top-buffer">
          {this.props.game.wrongImageOptions.slice(2, 4).map(choice => {
            return (
              <Col xs={6}>
                <div className="multi-height-restricted">
                  <CloudinaryContext cloudName="luupeli">
                    <Image publicId={choice.url} onClick={() => this.handleSubmit(choice)} style={this.style(choice)}>
                      <Transformation background="#000000" height="250" width="350" crop="lpad" />
                    </Image>
                  </CloudinaryContext>
                </div>
              </Col>
            )
          })}
        </Row>
      </Grid>
    )
  }

  render() {
    const debug = () => {
      if (process.env.NODE_ENV === 'development') {
        return (
          this.props.game.wrongImageOptions.map((choice, i) => {
            if (choice.correct) {
              return 'Oikea vastaus ylhäältä laskettuna: ' + i + '(laskenta alkaa nollasta)'
            }
            return null
          })
        )
      }
      return null
    }

    const houseEmoji = emoji.get('house')

    return (
      <div className="fullsize" z-index="0">
        <div>
          <h3>{this.props.game.currentImage.bone.nameLatin}, {this.props.game.currentImage.animal.name}</h3>
          <p>(klikkaa oikeaa kuvaa!)</p>
          {debug()}
        </div>
        <div>
          {this.renderImages()}
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
  setImagesToImageMultipleChoiceGame,
  setMessage,
  setScoreFlash,
  startGameClock,
  stopGameClock,
  setAnswerSound,
  setNeedToChangeQuestionFalse
}

const ConnectedImageMultipleChoiceGame = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageMultipleChoiceGame)
export default ConnectedImageMultipleChoiceGame
