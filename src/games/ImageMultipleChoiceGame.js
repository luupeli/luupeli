import React from 'react'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { setAnswer, setImageToAsk, setWrongImageOptions, setWrongAnswerOptions } from '../reducers/gameReducer'
import { setMessage } from '../reducers/messageReducer'
import { setScoreFlash } from '../reducers/scoreFlashReducer'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { Row, Col } from 'react-bootstrap'
import emoji from 'node-emoji'

class ImageMultipleChoiceGame extends React.Component {

  constructor(props) {
    super(props);
    this.timer = 0;
    this.state = {
      value: '',
      seconds: 0
    }
    this.handleSubmit = this.handleSubmit.bind(this)
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

    this.props.setScoreFlash(points, streakNote,streakEmoji,scoreFlashRowtext, 'success',3,true)

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

  answerButtons() {
    let choices = [
      {
        ...this.props.game.currentImage,
        correct: true
      }
    ]

    const wrongs = this.props.game.wrongImageOptions.map(img => {
      return { ...img, correct: false }
    })

    choices = wrongs.concat(choices)

    if (this.state.value === '' || this.state.value === undefined) {
      return (
        <Row className="show-grid">
          {choices.map(choice => {
            return (
              <Col xs={12} md={6}>
                <div className="height-restricted">
                  <CloudinaryContext cloudName="luupeli">
                    <Image publicId={choice.url} onClick={() => this.handleSubmit(choice)}>
                      <Transformation background="#000000" height="250" width="350" crop="lpad" radius="20" />
                    </Image>
                  </CloudinaryContext>
                </div>
              </Col>
            )
          }
          )}
        </Row>
      )
    } else if (this.state.value === this.props.game.currentImage.bone.nameLatin) {
      return choices.map(choice => {
        if (choice.correct) {
          return (
            <Col xs={12} md={6}>
              <div className="height-restricted">
                <CloudinaryContext cloudName="luupeli">
                  <Image publicId={choice.url} value={choice.bone.nameLatin}>
                    <Transformation border="15px_solid_rgb:29ae00" background="#000000" height="235" width="335" crop="lpad" radius="20" />
                  </Image>
                </CloudinaryContext>
              </div>
            </Col>
          )
        } else {
          return (
            <Col xs={12} md={6}>
              <div className="height-restricted">
                <CloudinaryContext cloudName="luupeli">
                  <Image publicId={choice.url} value={choice.bone.nameLatin}>
                    <Transformation background="#000000" height="250" width="350" crop="lpad" radius="20" />
                  </Image>
                </CloudinaryContext>
              </div>
            </Col>
          )
        }
      })
    } else {
      return choices.map(choice => {
        if (choice.correct) {
          return (
            <Col xs={12} md={6}>
              <div className="height-restricted">
                <CloudinaryContext cloudName="luupeli">
                  <Image publicId={choice.url} value={choice.bone.nameLatin}>
                    <Transformation border="15px_solid_rgb:29ae00" background="#000000" height="235" width="335" crop="lpad" radius="20" />
                  </Image>
                </CloudinaryContext>
              </div>
            </Col>
          )
        } else if (this.state.value.id === choice.id) {
          return (
            <Col xs={12} md={6}>
            <div className="height-restricted">
              <CloudinaryContext cloudName="luupeli">
                <Image publicId={choice.url} value={choice.bone.nameLatin}>
                  <Transformation border="15px_solid_rgb:ae0f0f" background="#000000" height="235" width="335" crop="lpad" radius="20" />
                </Image>
              </CloudinaryContext>
            </div>
          </Col>
          )
        } else {
          return (
            <Col xs={12} md={6}>
            <div className="height-restricted">
              <CloudinaryContext cloudName="luupeli">
                <Image publicId={choice.url} value={choice.bone.nameLatin}>
                  <Transformation background="#000000" height="250" width="350" crop="lpad" radius="20" />
                </Image>
              </CloudinaryContext>
            </div>
          </Col>
          )
        }
      })
    }
  }

  render() {
    return (
      <div className="bottom" z-index="3" position="absolute">
        <div className="intro" z-index="3" position="absolute">
          <h2>{this.props.game.currentImage.bone.nameLatin}, {this.props.game.currentImage.animal.name}</h2>
          <p>(klikkaa oikeaa kuvaa!)</p>
        </div>
        <div className="container" z-index="3" position="absolute">
          <div z-index="3" position="absolute">
            {this.answerButtons()}
          </div>
          <div className="col-md-6 col-md-offset-3" id="info">
            <h6>Vastausaikaa kulunut {Math.round(this.state.seconds / 10, 1)}</h6>
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
