import React from 'react'
import { Link } from 'react-router-dom'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { setAnswer, setImagesToImageMultipleChoiceGame, startGameClock, stopGameClock } from '../reducers/gameReducer'
import { setMessage } from '../reducers/messageReducer'
import { setScoreFlash } from '../reducers/scoreFlashReducer'
import { connect } from 'react-redux'
import emoji from 'node-emoji'
import { setAnswerSound } from '../reducers/soundReducer'

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
    window.onunload = function () { window.location.href = '/' }

  }

  componentDidMount() {
    this.props.setImagesToImageMultipleChoiceGame(this.props.game.images, this.props.game.answers)
    this.props.startGameClock()
    setInterval(() => {
      this.setState(() => {
        console.log('test')
        return { unseen: "does not display" }
      });
    }, 1000)
  }

  componentDidUpdate(prevProps) {
    if (this.props.game.endCounter !== prevProps.game.endCounter) {
      this.props.setImagesToImageMultipleChoiceGame(this.props.game.images, this.props.game.answers)
      this.props.startGameClock()
    }
    
    /*if (this.state.clickDisabled) {
			this.setState({ clickDisabled: false })
		}*/
  }

  handleSubmit(image) {
		if (this.state.clickDisabled) {
			return
		}
		console.log("CLICK!")
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
    if (started<1 || isNaN(started) || started===undefined) {
      started=this.state.internalStartedAt
    }

    let points = (Math.round((this.checkCorrectness(image) * Math.min(10, this.props.game.currentImage.bone.nameLatin.length)) *((30 + Math.max(0, (30 - ((current- started)/1000)) / 60))))) / 80
	console.log(this.props.game)


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

    this.props.setScoreFlash(points, streakNote, streakEmoji, scoreFlashRowtext, 'success', 2.5, true)
    this.setState({ choices: [] })
    console.log('points: '+points)
    console.log('this.state.selectedImage.bone.nameLatin: '+image.bone.nameLatin)
    console.log('gameClock: '+current-started)
    setTimeout(() => {
      this.props.setAnswer(this.props.game.currentImage, correctness, image.bone.nameLatin,image.animal.name, current-started, points)
      this.setState({ selectedId: undefined, selectedImage: undefined })
      this.setState({ clickDisabled: false })
    }, 3000)
  }

  checkCorrectness(image) {
    if (image.correct) {
      return 100
    } else {
      return 0
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
    if (choice.correct && undefined !== this.state.selectedId && choice.id !== this.state.selectedId) {
      return {
        borderStyle: 'solid',
        borderWidth: 20,
        borderRadius: 30,
        borderColor: 'green'
      }
    }
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

    return (
      <div className="bottom" z-index="3" position="relative">
        <div className="intro" z-index="3" position="relative">
          <h2>{this.props.game.currentImage.bone.nameLatin}, {this.props.game.currentImage.animal.name}</h2>
          <p>(klikkaa oikeaa kuvaa!)</p>
          {debug()}
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
        <div className="homeicon">
          <Link to='/'>
            <img src="homeicon.png" alt="Etusivulle"></img><p>Lopeta</p>
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
  setAnswerSound
}

const ConnectedImageMultipleChoiceGame = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageMultipleChoiceGame)
export default ConnectedImageMultipleChoiceGame
