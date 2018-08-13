import React from 'react'
import StringSimilarity from 'string-similarity'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { setAnswer, resetGameClock, setImageToAsk, setWrongAnswerOptions, setWrongImageOptions } from '../reducers/gameReducer'
import { setMessage } from '../reducers/messageReducer'
import { setScoreFlash } from '../reducers/scoreFlashReducer'
import { connect } from 'react-redux'
import emoji from 'node-emoji'
import { Animated } from "react-animated-css";


/**
 * WritingGame (run under Gameloop.js) is the standard game mode of Luupeli.
 * In WritingGame, the player needs to correctly identify each bone image shown. The identification is done by typing in the latin name of the bone.
 * Points are awarded for correct syntax AND speedy response time.
 */
class WritingGame extends React.Component {

  constructor(props) {
    super(props);
    this.timer = 0;
    this.state = {
      value: '',
      streakWG: 0,
      bonus: 1.0,
      currentScore: 0,
      currentScoreFlash: '',
      currentScoreFlashStyle: '',
      currentScoreFlashTime: 0,
      currentScoreFlashCutOff: 0,
      currentScoreFlashVisibility: false,
      fullEasyAnswer: '',
      partialEasyAnswer: '__',
      previousRevealClock: 0,
      easyDifficultyPenalty: 1.0,
      animationActive: true

    }
    this.getRandomInt = this.getRandomInt.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.revealPartialAnswer = this.revealPartialAnswer.bind(this)
    this.gameClockUnits = this.gameClockUnits.bind(this)
    window.onunload = function () { window.location.href = '/' }
  }

  gameClockUnits() { return Math.round(((new Date()).getTime() - this.props.game.startTime) / 50) }
  componentDidMount() {
    this.props.setImageToAsk(this.props.game.images, this.props.game.answers)
  }

  componentDidUpdate(prevProps) {
    if (this.props.game.endCounter !== prevProps.game.endCounter) {
      this.props.setImageToAsk(this.props.game.images, this.props.game.answers)
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }
  /**
   * As the player submits the answer, the points will be calculated, gameplay stats will be stored and player message and score flash balloon will be generated.
   * @param {*} event 
   */
  handleSubmit(event) {
    event.preventDefault()
    let currentStreak = this.state.streakWG
    let currentBonus = this.state.bonus
    let streakNote = ''
    let streakEmoji = emoji.get('yellow_heart')
    let correctness = 'Melkein oikein'
    let correctnessN = this.checkCorrectness()

    let points = (Math.round((correctnessN * Math.max(20, this.props.game.currentImage.bone.nameLatin.length - 3)) * ((900 + Math.max(0, (900 - this.gameClockUnits()))) / 1800))) / 20



    if (this.gameClockUnits() < 200 && (StringSimilarity.compareTwoStrings(this.state.partialEasyAnswer.toLowerCase(), this.props.game.currentImage.bone.nameLatin.toLowerCase()) < 0.90)) {
      points = points * ((400 - this.gameClockUnits()) / 40)
    }

    if (this.props.game.gameDifficulty === 'hard' && this.props.game.gameLength > this.props.game.endCounter && this.state.bonus < 1.5) {
      points = points * 0.15 // Here we strongly penalize the 'hard mode' player for answering PREVIOUSLY incorrectly
      points = 10;
    }

    let easyBonusPenalizer = 0

    if (this.props.game.gameDifficulty === 'easy') {
      points = points * 0.5
      points = points * Math.max(0.2, this.state.easyDifficultyPenalty)
      if (StringSimilarity.compareTwoStrings(this.state.partialEasyAnswer.toLowerCase(), this.props.game.currentImage.bone.nameLatin.toLowerCase()) > 0.9) {
        points = points * 0.25
      }
      if (points < 20) {
        points = 20
      }
      if (currentBonus > 1.99) {
        currentBonus = 2.0
      }
    }

    let hardBonus = 0.0
    if (this.props.game.gameDifficulty === 'hard') {
      hardBonus = 1.0

    }

    if (correctnessN > 99) {
      points = points * 5
      correctness = 'Oikein'
      this.setState({ animationActive: false, streakWG: currentStreak + 1, bonus: currentBonus + 1.0 + hardBonus, value: '', previousRevealClock: 0, partialEasyAnswer: '__', easyDifficultyPenalty: 1.0 })
      streakNote = currentBonus + 'x!'
      if (currentBonus < 1.5) {
        streakNote = ''
      }
      streakEmoji = require('node-emoji')
      streakEmoji = streakEmoji.get('fire')
      console.log(streakEmoji)
    } else {

      if (this.props.game.gameDifficulty === 'hard') {
        points = 40 * currentBonus
      }

      this.setState({ animationActive: false, streakWG: 0, bonus: 1.0, value: '', previousRevealClock: 0, partialEasyAnswer: '__', easyDifficultyPenalty: 1.0 })
      streakNote = ''
      if (correctnessN < 1) {
        streakEmoji = require('node-emoji')
        streakEmoji = streakEmoji.get('poop')
      }
    }
    if (correctnessN > 85) {
      points = points * 2 * currentBonus

    }


    points = Math.round(points / 20) * 20
    if (correctnessN <= 70) {
      correctness = 'Väärin'
      points = 0
    }

    let scoreFlashRowtext = '' + streakNote + '' + streakEmoji + '' + points + ' PTS!!!' + streakEmoji
    this.props.resetGameClock()
    this.props.setScoreFlash(points, streakNote, streakEmoji, scoreFlashRowtext, 'success', 3, true)


    let answerMoment = this.gameClockUnits()
    let answerCurrentImage = this.props.game.currentImage
    let answerCorrectness = this.checkCorrectness()


    console.log('BEFORE TIMEOUT: ' + this.gameClockUnits())
    setTimeout(() => {
      console.log('AFTER timeout!! ' + this.gameClockUnits())
      this.props.setAnswer(answerCurrentImage, answerCorrectness, this.state.value, answerMoment, points)
      this.setState({ animationActive: true })
      this.props.setImageToAsk(this.props.game.images, this.props.game.answers)
      // this.props.setWrongImageOptions(this.props.game.currentImage, this.props.game.images)
      //  this.props.setWrongAnswerOptions(this.props.game.currentImage, this.props.game.images)
      this.createMessage(points)
    }, 2000
    );


  }


  /**
   * This method measures the "correctness" (or similarity) of the answer string compared to the actual latin name string.
   * The similarity is scaled from 0 to 100, with 100 being a 100 % correct answer.
   * This method should probably be developed further, perhaps with similarity being measured on a word-to-word basis rather than as a full string.
   * Also, disregarding case is not proper, as the latin names ARE case-sensitive.
   */
  checkCorrectness() {
    var playerAnswer = this.state.value.toLowerCase().replace(", ", " ja ").replace(" & ", " ja ")
    var latinName = this.props.game.currentImage.bone.nameLatin.toLowerCase().replace(" & ", " ja ")

    return 100 * StringSimilarity.compareTwoStrings(playerAnswer, latinName); // calculate similarity   
    //return 100 * StringSimilarity.compareTwoStrings(this.props.game.currentImage.bone.nameLatin.toLowerCase(), this.state.value.toLowerCase()); // calculate similarity   

  }

  /**
   * Here we generate a message for the player which indicates how correct the answer was.
   * Answers with similarity of 70 or more are considered as "almost correct" and awarded some points.
   * Answers with similarity of 100 are considered as truly correct.
   * 
   * @param {*} points ... the amount of points awarded for the answer.
   */
  createMessage(points) {
    this.setState({
      seconds: 0
    })

    const similarity = this.checkCorrectness()

    if (this.props.game.currentImage.bone.nameLatin.toLowerCase() === this.state.value.toLowerCase()) {
      this.props.setMessage('Oikein! ' + points + ' pistettä!', 'success')
    } else if (similarity > 70) {
      this.props.setMessage('Melkein oikein! ' + points + ' pistettä! (similarity: ' + similarity.toPrecision(2) + '). Vastasit: ' + this.state.value.toLowerCase() + '. Oikea vastaus oli ' + this.props.game.currentImage.bone.nameLatin.toLowerCase(), 'warning')
    } else {
      this.props.setMessage('Väärin (similarity: ' + similarity.toPrecision(2) + ')! Oikea vastaus oli ' + this.props.game.currentImage.bone.nameLatin.toLowerCase(), 'danger')
    }
  }


  /**
   * As demonstrated on Mozilla.org's Javascript reference
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
   * @param {*} min minimum value for the random int
   * @param {*} max max value for the random int
   */
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  revealPartialAnswer() {
    let skipState = false;
    if (this.state.partialEasyAnswer.length < 3) {
      skipState = true
    }
    const gameClock = this.gameClockUnits()
    if (this.getRandomInt(0, 25) < 1 + gameClock / 400 && gameClock - this.state.previousRevealClock > 7) {

      let randomIndex = this.getRandomInt(0, this.props.game.currentImage.bone.nameLatin.length);
      let newPartial = ''
      let addPenalty = 0.0
      for (var i = 0; i < this.props.game.currentImage.bone.nameLatin.length; i++) {
        if (i === randomIndex || this.props.game.currentImage.bone.nameLatin.charAt(i) === ' ') {
          newPartial = newPartial + this.props.game.currentImage.bone.nameLatin.charAt(i)
          if (!skipState) {
            if (this.state.partialEasyAnswer.charAt(i) === '_') {
              addPenalty = 0.02/*05+Math.max(0,Math.min(((50-(this.props.game.currentImage.bone.nameLatin.length*2))/1000),0.06))*/
              if (this.props.game.currentImage.bone.nameLatin.length < 10) {
                addPenalty = addPenalty * 2;
              }
            }
          }
        } else if (!skipState) {
          newPartial = newPartial + this.state.partialEasyAnswer.charAt(i)
        } else {
          newPartial = newPartial + '_'
        }

        //   newPartial[randomIndex] =this.props.game.currentImage.bone.nameLatin[randomIndex]
        this.setState({ previousRevealClock: gameClock, partialEasyAnswer: newPartial, easyDifficultyPenalty: this.state.easyDifficultyPenalty - addPenalty })
        // console.log('new partial on nyt : ' + newPartial)
      }

    }
  }

  /**
   * Notice that the bone images are fethched from Cloudinary, with a resize transformation done based on the measured window size.
   */
  render() {

    if (this.gameClockUnits() > 60 && this.props.game.gameDifficulty === 'easy') {
      this.revealPartialAnswer()
    }

    const imageWidth = () => {              // Here we try to measure the window size in order to resize the bone image accordingly
      const windowWidth = Math.min(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
      )
      if (windowWidth > 1000) {
        return 1000
      }
      return Math.round(windowWidth * 0.7)
    }

    const imageHeight = () => {              // Here we try to measure the window size in order to resize the bone image accordingly
      const windowHeight = Math.min(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
      )
      if (windowHeight > 1000) {
        return 1000
      }
      return Math.round(windowHeight * 0.7)
    }

    let attempts = this.props.game.currentImage.attempts
    let correctAttempts = this.props.game.currentImage.correctAttempts
    let correctPercentile = Math.round(100 * (correctAttempts / attempts))
    if (isNaN(correctPercentile) || correctPercentile < 0) { correctPercentile = 0 }

    //{/* <Transformation width={imageWidth()} crop="fill" format="png" radius="20" /> */}
    //            {/* <Transformation width={imageWidth()} crop="fill" format="png" radius="20" /> */}

    let cheat = ''
    if (this.props.game.gameDifficulty === 'easy') {
      cheat = this.state.partialEasyAnswer
    }

    if (!this.state.animationActive) {
      cheat = this.props.game.currentImage.bone.nameLatin
    } else {
      cheat = '???'
    }

    let description = this.props.game.currentImage.bone.description
    let name = this.props.game.currentImage.bone.name
    if (this.props.game.gameDifficulty === 'hard') {
      name = 'LUU-5!'
      if (this.props.game.gameLength === 15) {
        name = 'TENTTI!'
      }
    }

    return (
      <div className="bottomxxx">
        <div className="row" id="image-holder">
          <div className="intro">
            <CloudinaryContext cloudName="luupeli">
              <div className="height-restricted" >
                <Animated animationIn="zoomIn faster" animationOut="zoomOut faster" animationOutDelay="0" isVisible={this.state.animationActive}>
                  <Image id="bone-image" publicId={this.props.game.currentImage.url}>

                    <Transformation width={imageWidth()} />

                  </Image>
                </Animated>
              </div>
            </CloudinaryContext>
          </div>
        </div>
        {/* <div className="row"> */}
        <div>
          <Animated animationIn="zoomIn faster" animationOut="zoomOut faster" animationInDelay="550" animationOutDelay="250" isVisible={this.state.animationActive}>
            <center>
              <h3 id="heading">{name}</h3></center>
          </Animated>
        </div>
        <Animated animationIn="zoomIn faster" animationOut="zoomOut faster" animationInDelay="1500" animationOutDelay="500" isVisible={this.state.animationActive}>
          <p>{description}</p>
        </Animated>
        {/* <p>Tätä kuvaa on yritetty {attempts} kertaa, niistä {correctAttempts} oikein. Oikeita vastauksia: {correctPercentile} % kaikista yrityksistä.</p> */}
        {/* <p>Img width: {imageWidth()} | height: {imageHeight()}</p> */}
        {/* <p>URL: {this.props.game.currentImage.url}</p> */}
        <Animated animationIn="zoomIn faster" animationOut="zoomOut faster" animationInDelay="1750" animationOutDelay="1500" isVisible={this.state.animationActive}>
          <p>{cheat}</p>
        </Animated>
        {/* </div>
        </div>
         */}
        <div className="game-answer-input" />
        <form
          id='gameForm'
          onSubmit={this.handleSubmit}
        >
          <div className="game-text-input">
            <input
              id="gameTextInput"
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </div>
          <div className="btn-group">
            <button classname="gobackbutton" type="submit" id="submitButton">Vastaa</button>
          </div>

        </form>
        <h6>debug: {this.props.game.currentImage.bone.nameLatin}</h6>
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
  setScoreFlash,
  resetGameClock
}

const ConnectedWritingGame = connect(
  mapStateToProps,
  mapDispatchToProps
)(WritingGame)
export default ConnectedWritingGame
