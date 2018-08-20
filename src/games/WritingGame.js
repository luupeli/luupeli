import React from 'react'
import StringSimilarity from 'string-similarity'
import { Redirect, Link } from 'react-router-dom'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { setAnswer, setImageToWritingGame, startGameClock, stopGameClock } from '../reducers/gameReducer'
import { setScoreFlash } from '../reducers/scoreFlashReducer'
import { setAnswerSound } from '../reducers/soundReducer'
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
      lastValue: undefined,
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

  gameClockUnits() { return Math.round(((new Date).getTime() - this.props.game.startedAt) / 50) }

  componentDidMount() {
    this.props.setImageToWritingGame(this.props.game.images, this.props.game.answers)
    this.props.startGameClock()
  }

  componentDidUpdate(prevProps) {
    if (this.props.game.endCounter !== prevProps.game.endCounter) {
      this.props.setImageToWritingGame(this.props.game.images, this.props.game.answers)
      this.props.startGameClock()
    }
  }

  componentDidMount() {
		setInterval(() => {
			this.setState(() => {
				// console.log('test')
				return { unseen: "does not display" }
			});
		}, 1000);
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
    this.props.stopGameClock()
    this.setState({ lastValue: this.state.value })
    let answerCorrectness = this.checkCorrectness(this.state.value)
    this.props.setAnswerSound(answerCorrectness)

    let currentStreak = this.state.streakWG
    let currentBonus = this.state.bonus
    let streakNote = ''
    let streakEmoji = emoji.get('yellow_heart')
    let correctness = 'Melkein oikein'

    let points = (Math.round((answerCorrectness * Math.max(20, this.props.game.currentImage.bone.nameLatin.length - 3)) * ((900 + Math.max(0, (900 - this.gameClockUnits()))) / 1800))) / 20



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

    if (answerCorrectness > 99) {
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
      if (answerCorrectness < 1) {
        streakEmoji = require('node-emoji')
        streakEmoji = streakEmoji.get('poop')
      }
    }
    if (answerCorrectness > 85) {
      points = points * 2 * currentBonus

    }


    points = Math.round(points / 20) * 20
    if (answerCorrectness <= 70) {
      correctness = 'Väärin'
      points = 0
    }

    let scoreFlashRowtext = '' + streakNote + '' + streakEmoji + '' + points + ' PTS!!!' + streakEmoji
    this.props.setScoreFlash(points, streakNote, streakEmoji, scoreFlashRowtext, 'success', 2.5, true)

    let answerMoment = this.gameClockUnits()
    let answerCurrentImage = this.props.game.currentImage

    console.log('BEFORE TIMEOUT: ' + this.gameClockUnits())
    setTimeout(() => {
      console.log('AFTER timeout!! ' + this.gameClockUnits())
      this.props.setAnswer(answerCurrentImage, answerCorrectness, this.state.lastValue, this.props.game.gameClock, points)
      this.setState({ animationActive: true, lastValue: undefined })
    }, 2500
    );


  }


  /**
   * This method measures the "correctness" (or similarity) of the answer string compared to the actual latin name string.
   * The similarity is scaled from 0 to 100, with 100 being a 100 % correct answer.
   * This method should probably be developed further, perhaps with similarity being measured on a word-to-word basis rather than as a full string.
   * Also, disregarding case is not proper, as the latin names ARE case-sensitive.
   */
  checkCorrectness(answer) {
    var playerAnswer = answer.toLowerCase().replace(", ", " ja ").replace(" & ", " ja ")
    var latinName = this.props.game.currentImage.bone.nameLatin.toLowerCase().replace(" & ", " ja ")

    return 100 * StringSimilarity.compareTwoStrings(playerAnswer, latinName); // calculate similarity   
    //return 100 * StringSimilarity.compareTwoStrings(this.props.game.currentImage.bone.nameLatin.toLowerCase(), this.state.value.toLowerCase()); // calculate similarity   

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

  revealPartialAnswer(currentMoment, currentLatin) {
    let skipState = false;
    if (this.state.partialEasyAnswer.length < 3) {
      skipState = true
    }
    let previousClock =  this.state.previousRevealClock 
    if (previousClock===undefined) {
      previousClock=0
    }

  //  const gameClock = this.gameClockUnits()
  
    if (this.getRandomInt(0, 15) < 1 + Math.min(12,(this.state.easyDifficultyPenalty*5)+(currentLatin.length/5)) && currentMoment - previousClock > (5000*this.state.easyDifficultyPenalty)) { //+(2000*this.state.easyDifficultyPenalty)
      console.log('entered inside random')
      let randomIndex = this.getRandomInt(0, currentLatin.length);
      let newPartial = ''
      let addPenalty = 0.0
      for (var i = 0; i <currentLatin.length; i++) {
        if (i === randomIndex || currentLatin.charAt(i) === ' ') {
          newPartial = newPartial + currentLatin.charAt(i)
          if (!skipState) {
            if (this.state.partialEasyAnswer.charAt(i) === '_' || this.state.partialEasyAnswer.charAt(i)!==currentLatin.charAt(i)) {
              addPenalty = 0.02/*05+Math.max(0,Math.min(((50-(this.props.game.currentImage.bone.nameLatin.length*2))/1000),0.06))*/
              if (currentLatin.length < 10) {
                addPenalty = addPenalty * 2;
              }
            }
          }
        } else if (!skipState) {
          if (this.state.partialEasyAnswer.charAt(i)!=='_' && this.state.partialEasyAnswer.charAt(i)!==currentLatin.charAt(i)) {
            newPartial = newPartial + currentLatin.charAt(i)
          } else {
          newPartial = newPartial + this.state.partialEasyAnswer.charAt(i)
          }
        } else {
          newPartial = newPartial + '_'
        }

        //   newPartial[randomIndex] =this.props.game.currentImage.bone.nameLatin[randomIndex]
        this.setState({ previousRevealClock: currentMoment, partialEasyAnswer: newPartial, easyDifficultyPenalty: this.state.easyDifficultyPenalty - addPenalty })
        // console.log('new partial on nyt : ' + newPartial)
      }

    }
  }

  /**
   * Notice that the bone images are fethched from Cloudinary, with a resize transformation done based on the measured window size.
   */
  render() {

    var currentMoment = new Date().getTime()

    const answerInput = () => {
      if (this.state.lastValue === undefined) {
        return (
          <div>
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
          </div>
        )
      } else {
        if (this.checkCorrectness(this.state.lastValue) > 99) {
          return (
            <div>
              <div className="game-text-input" style={{ color: 'green' }}>
                {/*     <Sounds correctness={this.checkCorrectness(this.state.lastValue)} />*/}
                <input
                  id="gameTextInput"
                  type="text"
                  value={this.state.lastValue}
                  onChange={this.handleChange}
                  disabled
                />
              </div>
              <div className="btn-group">
                <button classname="gobackbutton" disabled id="submitButton">Vastaa</button>
              </div>
            </div>
          )
        } else {
          return (
            <div>
              <div className="game-text-input" style={{ color: 'red' }}>
                {/*    <Sounds correctness={this.checkCorrectness(this.state.lastValue)} />*/}
                <input
                  id="gameTextInput"
                  type="text"
                  value={this.state.lastValue}
                  onChange={this.handleChange}
                  disabled
                />
              </div>
              <div className="btn-group">
                <button classname="gobackbutton" disabled id="submitButton">Vastaa</button>
              </div>
            </div>
          )
        }
      }
    }


    var timeToCompare = this.props.game.startedAt
    if (timeToCompare=== undefined) {
    timeToCompare=currentMoment-5001
    }

    console.log('curr: '+currentMoment+" vs started: "+timeToCompare)
    if (currentMoment - timeToCompare > (5000) && this.props.game.gameDifficulty === 'easy') {
      console.log('trying to reveal...')
      this.revealPartialAnswer(currentMoment,this.props.game.currentImage.bone.nameLatin)
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
    if (this.props.game.gameDifficulty === 'easy' && this.state.animationActive) {
      if (currentMoment - timeToCompare > 5000) {
      cheat = this.state.partialEasyAnswer
      } else {
        cheat = '____'}
    } else if (!this.state.animationActive) {
      cheat = this.props.game.currentImage.bone.nameLatin
    } else {
      cheat = '???'
    }

    let description = this.props.game.currentImage.bone.description
    let name = this.props.game.currentImage.bone.name
    if (this.props.game.gameDifficulty === 'hard') {
      name = 'LUU-5!'
      if (this.props.game.gameLength == 15) {
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
          {answerInput()}
        </form>
        {/*   <h6>debug: {this.props.game.currentImage.bone.nameLatin}</h6> */}
        <div className="homeicon">
          <Link to='/'>
            <img src="homeicon.png" alt="Etusivulle"></img><p>Lopeta</p>
          </Link>
        </div>
      </div >

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
  setImageToWritingGame,
  setScoreFlash,
  startGameClock,
  stopGameClock,
  setAnswerSound
}

const ConnectedWritingGame = connect(
  mapStateToProps,
  mapDispatchToProps
)(WritingGame)
export default ConnectedWritingGame
