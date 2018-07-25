import React from 'react'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { setAnswer, setImageToAsk, setWrongAnswerOptions, setWrongImageOptions } from '../reducers/gameReducer'
import { setMessage } from '../reducers/messageReducer'
import { setScoreFlash } from '../reducers/scoreFlashReducer'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { Row, Col } from 'react-bootstrap'

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
      value: '',
      seconds: 0
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  /**
 * As the player submits the answer, the points will be calculated, gameplay stats will be stored and player message will be generated.
 * @param {*} event 
 */
  handleSubmit(event) {
    event.preventDefault()
    this.setState({ value: event.target.value })
    this.createMessage(event.target.value)

    let points = (Math.round((this.checkCorrectness(event.target.value) * Math.max(10, this.props.game.currentImage.bone.nameLatin.length)) * ((300 + Math.max(0, (300 - this.state.seconds))) / 600))) / 20

    if (this.checkCorrectness(event.target.value) > 99) {
      points = points * 10
    }
    points = Math.round(points / 20) * 20

    if (this.checkCorrectness(event.target.value) < 70) {
      points = 0
    }

    setTimeout(() => {
      this.props.setAnswer(this.props.game.currentImage, this.checkCorrectness(this.state.value), this.state.value, this.state.seconds - 3, points)
      this.setState({ value: '' })
      this.props.setImageToAsk(this.props.game.images, this.props.game.answers)
      this.props.setWrongImageOptions(this.props.game.currentImage, this.props.game.images)
      this.props.setWrongAnswerOptions(this.props.game.currentImage, this.props.game.images)
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

  tick() {
    this.setState(prevState => ({
      seconds: prevState.seconds + 1,
    }));
  }

  componentWillMount() {
    this.interval = setInterval(() => this.tick(), 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  createMessage(answer) {
    this.setState({
      seconds: 0
    })

    const correctness = this.checkCorrectness(answer)

    if (correctness === 100) {
      this.props.setMessage('Oikein!', 'success', 3)
    } else {
      this.props.setMessage('Väärin! Oikea vastaus oli ' + this.props.game.currentImage.bone.nameLatin, 'danger', 3)
    }
  }

    /**
   * This method generates the buttons to be displayed. If the answer is correct, the selected button is green. 
   * If wrongly answered, the selected button is red and the correct answer is green.
  */
  answerButtons() {
    let choices = [
      {
        nameLatin: this.props.game.currentImage.bone.nameLatin,
        correct: true
      }
    ]

    const wrongs = this.props.game.wrongAnswerOptions.map(nameLatin => {
      return { nameLatin: nameLatin, correct: false }
    })

    choices = wrongs.concat(choices)

    // NOTE: The correct answer is all the time at the right corner. We have to sort answer option on some way.

    if (this.state.value === '' || this.state.value === undefined) {
      return (
        choices.map(choice => <Button bsStyle='info' value={choice.nameLatin} onClick={this.handleSubmit}>{choice.nameLatin}</Button>
        )
      )
    } else if (this.state.value === this.props.game.currentImage.bone.nameLatin) {
      return choices.map(choice => {
        if (choice.correct) {
          return <Button bsStyle='success' disabled={true} value={choice.nameLatin}>{choice.nameLatin}</Button>
        } else {
          return <Button bsStyle='info' disabled={true} value={choice.nameLatin}>{choice.nameLatin}</Button>
        }
      })
    } else {
      return choices.map(choice => {
        if (choice.correct) {
          return <Button bsStyle='success' disabled={true} value={choice.nameLatin}>{choice.nameLatin}</Button>
        } else if (this.state.value === choice.nameLatin) {
          return <Button bsStyle='danger' disabled={true} value={choice.nameLatin}>{choice.nameLatin}</Button>
        } else {
          return <Button bsStyle='info' disabled={true} value={choice.nameLatin}>{choice.nameLatin}</Button>
        }
      })
    }
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
      <div class="bottom">
        <div class="row" id="image-holder">
          <div class="intro">
            <CloudinaryContext cloudName="luupeli">
              <div class="height-restricted">
                <Image publicId={this.props.game.currentImage.url}>
                  <Transformation width={imageWidth()} crop="fill" radius="20" />
                </Image>
              </div>
            </CloudinaryContext>
          </div>
        </div>
        <div class="row">
        </div>
        <div class="container">
          <div class="col-md-6 col-md-offset-3" id="info">
            <h6>Vastausaikaa kulunut {Math.round(this.state.seconds / 10, 1)}</h6>
            <p>{this.props.game.currentImage.bone.description}</p>
          </div>
        </div>
        <div class="answer-input">
          <div class="container">
            <div class="intro" />
            {this.answerButtons()}
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
  setAnswer,
  setImageToAsk,
  setWrongAnswerOptions,
  setWrongImageOptions,
  setMessage,
  setScoreFlash
}

const ConnectedMultipleChoiceGame = connect(
  mapStateToProps,
  mapDispatchToProps
)(MultipleChoiceGame)
export default ConnectedMultipleChoiceGame
