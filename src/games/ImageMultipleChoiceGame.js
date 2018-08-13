import React from 'react'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { setAnswer, setImageToAsk, setWrongImageOptions, setWrongAnswerOptions } from '../reducers/gameReducer'
import { setMessage } from '../reducers/messageReducer'
import { setScoreFlash } from '../reducers/scoreFlashReducer'
import { connect } from 'react-redux'
import emoji from 'node-emoji'

class ImageMultipleChoiceGame extends React.Component {

  constructor(props) {
    super(props);
    this.timer = 0;
    this.state = {
      selectedId: '',
      selectedImage: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    window.onunload = function () { window.location.href = '/' }

  }

  componentDidMount() {
    this.props.setWrongImageOptions(this.props.game.images, this.props.game.answers)
  }

  componentDidUpdate(prevProps) {
    if (this.props.game.endCounter !== prevProps.game.endCounter) {
      this.props.setWrongImageOptions(this.props.game.images, this.props.game.answers)
    }
  }

  handleSubmit(image) {
    this.setState({
      selectedId: image.id,
      selectedImage: image
    })
    const correctness = this.checkCorrectness(image)

    let points = (Math.round((this.checkCorrectness(image) * Math.max(10, this.props.game.currentImage.bone.nameLatin.length)) * ((300 + Math.max(0, (300 - this.state.seconds))) / 600))) / 20

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
      this.props.setAnswer(this.props.game.currentImage, correctness, this.state.selectedImage.bone.nameLatin, this.props.game.gameClock, points)
      this.setState({ selectedId: '', selectedImage: '' })
    }, 3000)
  }

  checkCorrectness(image) {
    if (image.correct) {
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
    if (choice.correct && choice.id === this.state.selectedId) {
      return {
        borderStyle: 'solid',
        borderWidth: 20,
        borderRadius: 30,
        borderColor: 'green'
      }
    } else if (choice.correct === false && choice.id === this.state.selectedId) {
      return {
        borderStyle: 'solid',
        borderWidth: 20,
        borderRadius: 30,
        borderColor: 'red'
      }
    }
    if (choice.correct && '' !== this.state.selectedId && choice.id !== this.state.selectedId) {
      return {
        borderStyle: 'solid',
        borderWidth: 20,
        borderRadius: 30,
        borderColor: 'green'
      }
    }
  }

  render() {
    return (
      <div className="bottom" z-index="3" position="relative">
        <div className="intro" z-index="3" position="relative">
          <h2>{this.props.game.currentImage.bone.nameLatin}, {this.props.game.currentImage.animal.name}</h2>
          <p>(klikkaa oikeaa kuvaa!)</p>
          {this.props.game.wrongImageOptions.map((choice, i) => {
            if (choice.correct) {
              return 'Oikea vastaus ylhäältä laskettuna: ' + i + '(laskenta alkaa nollasta)'
            }
          return null
          })}
        </div>
        <div className="container" z-index="3" position="relative">
          <div z-index="3" position="relative">

            {this.props.game.wrongImageOptions.map(choice => {
              return (
                <div className="multi-height-restricted" style={this.style(choice)}>
                  <CloudinaryContext cloudName="luupeli">
                    <Image publicId={choice.url} onClick={() => this.handleSubmit(choice)}>
                      <Transformation background="#000000" height="250" width="350" crop="lpad" />
                    </Image>
                  </CloudinaryContext>
                </div>
              )
            }
            )}

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
