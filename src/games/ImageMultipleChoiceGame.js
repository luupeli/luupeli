import React from 'react'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { setAnswer, setImageToAsk, setWrongImageOptions, setWrongAnswerOptions } from '../reducers/gameReducer'
import { setMessage } from '../reducers/messageReducer'
import { setScoreFlash } from '../reducers/scoreFlashReducer'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import emoji from 'node-emoji'

class ImageMultipleChoiceGame extends React.Component {

  constructor(props) {
    super(props);
    this.timer = 0;
    this.state = {
      value: '',
      seconds: 0,
      choices: [],
      wrongs: [],

    }
    this.handleSubmit = this.handleSubmit.bind(this)
    window.onunload = function () { window.location.href = '/' }
  }

  handleSubmit(image) {
    this.setState({ value: image })
    this.createMessage(image)

    let points = (Math.round((this.checkCorrectness(image) * Math.max(10, this.props.game.currentImage.bone.nameLatin.length)) * ((300 + Math.max(0, (300 - this.state.seconds))) / 600))) / 20

    if (this.checkCorrectness(image) > 99) {
      points = points * 10
    }
    points = Math.round(points / 20) * 20

    if (this.checkCorrectness(image) < 70) {
      points = 0
    }

    const correctness = this.checkCorrectness(image)
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
    this.setState({ choices: [] })

    setTimeout(() => {
      this.props.setAnswer(this.props.game.currentImage, this.checkCorrectness(this.state.value), this.state.value.bone.nameLatin, this.state.seconds - 3, points)
      this.setState({ value: '' })
      this.props.setImageToAsk(this.props.game.images, this.props.game.answers)
      this.props.setWrongImageOptions(this.props.game.currentImage, this.props.game.images)
      this.props.setWrongAnswerOptions(this.props.game.currentImage, this.props.game.images)
    }, 5000)
  }

  checkCorrectness(image) {
    if (this.props.game.currentImage.id === image.id) {
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

  createMessage(image) {
    this.setState({
      seconds: 0
    })

    const correctness = this.checkCorrectness(image)

    if (correctness === 100) {
      this.props.setMessage('Oikein!', 'success')
    } else {
      this.props.setMessage('Väärin!', 'danger')
    }
  }

  style(choice) {
    if (choice.correct && choice === this.state.value) {
      return {
        borderStyle: 'solid',
        borderWidth: 20,
        borderRadius: 30,
        borderColor: 'green'
      }
    } else if (choice.correct === false && choice === this.state.value) {
      return {
        borderStyle: 'solid',
        borderWidth: 20,
        borderRadius: 30,
        borderColor: 'red'
      }
    }
    if (choice.correct === true && '' !== this.state.value && choice !== this.state.value) {
      return {
        borderStyle: 'solid',
        borderWidth: 20,
        borderRadius: 30,
        borderColor: 'green'  
      }
    }
  }

  answerButtons() {
    return (
      <Row className="show-grid">
        {this.props.game.wrongImageOptions.map(choice => {
          return (
            <Col xs={12} md={6}>
              <div className="multi-height-restricted" style={this.style(choice)}>
                <CloudinaryContext cloudName="luupeli">
                  <Image publicId={choice.url} onClick={() => this.handleSubmit(choice)}>
                    <Transformation background="#000000" height="250" width="350" crop="lpad" />
                  </Image>
                </CloudinaryContext>
              </div>
            </Col>
          )
        }
        )}
      </Row>
    )
  }

  render() {
    return (
      <div className="bottom" z-index="3" position="relative">
        <div className="intro" z-index="3" position="relative">
          <h2>{this.props.game.currentImage.bone.nameLatin}, {this.props.game.currentImage.animal.name}</h2>
          <p>(klikkaa oikeaa kuvaa!)</p>
        </div>
        <div className="container" z-index="3" position="relative">
          <div z-index="3" position="relative">
            {this.answerButtons()}
          </div>
          {/* <div className="col-md-6 col-md-offset-3" id="info">
            <h6>Vastausaikaa kulunut {Math.round(this.state.seconds / 10, 1)}</h6>
          </div> */}
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
  setWrongImageOptions,
  setWrongAnswerOptions,
  setMessage,
  setScoreFlash
}

const ConnectedImageMultipleChoiceGame = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageMultipleChoiceGame)
export default ConnectedImageMultipleChoiceGame
