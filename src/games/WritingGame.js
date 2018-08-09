import React from 'react'
import StringSimilarity from 'string-similarity'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { setAnswer, setImageToAsk, setWrongAnswerOptions, setWrongImageOptions } from '../reducers/gameReducer'
import { setMessage } from '../reducers/messageReducer'
import { setScoreFlash } from '../reducers/scoreFlashReducer'
import { connect } from 'react-redux'
import emoji from 'node-emoji'
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
      easyDifficultyPenalty: 1.0
      
    }
    this.getRandomInt = this.getRandomInt.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.revealPartialAnswer = this.revealPartialAnswer.bind(this)
    window.onunload = function () { window.location.href = '/' }
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
    let points = (Math.round((this.checkCorrectness() * Math.max(10, this.props.game.currentImage.bone.nameLatin.length)) * ((900 + Math.max(0, (900 - this.props.game.gameClock))) / 1800))) / 20
    
    if (this.props.game.gameClock < 200) {
      points = points * ((400 - this.props.game.gameClock) / 40)
    }
    if (this.checkCorrectness() > 99) {
      points = points * 5
      correctness = 'Oikein'
      this.setState({ streakWG: currentStreak + 1, bonus: currentBonus + 1.0 })
      streakNote = currentBonus + 'x!'
      if (currentBonus < 1.5) {
        streakNote = ''
      }
      streakEmoji = require('node-emoji')
      streakEmoji = streakEmoji.get('fire')
      console.log(streakEmoji)
    } else {
      this.setState({ streakWG: 0, bonus: 1.0 })
      streakNote = ''
      if (this.checkCorrectness() < 1) {
        streakEmoji = require('node-emoji')
        streakEmoji = streakEmoji.get('poop')
      }
    }
    if (this.checkCorrectness() > 85) {
      points = points * 2 * currentBonus
    }

    if (this.props.game.gameDifficulty==='easy') {
      points = points * 0.75
      points = points / this.state.easyDifficultyPenalty
      if (points<100) {
        points=100
      }
    }

    points = Math.round(points / 20) * 20
    if (this.checkCorrectness() <= 70) {
      correctness = 'Väärin'
      points = 0
    }
    
    let scoreFlashRowtext = '' + streakNote + '' + streakEmoji + '' + points + ' PTS!!!' + streakEmoji
    this.props.setScoreFlash(points, streakNote,streakEmoji,scoreFlashRowtext, 'success',3,true)
    
    this.setState({ value: '',previousRevealClock: 0,partialEasyAnswer: '__' })
    this.props.setAnswer(this.props.game.currentImage, this.checkCorrectness(), this.state.value, this.props.game.gameClock, points)
    this.props.setImageToAsk(this.props.game.images, this.props.game.answers)
    this.props.setWrongImageOptions(this.props.game.currentImage, this.props.game.images)
    this.props.setWrongAnswerOptions(this.props.game.currentImage, this.props.game.images)
    this.createMessage(points)  
  
    // let newPartial =''
    // for (var i = 0; i< this.props.game.currentImage.bone.nameLatin.length; i++) {
    //   newPartial = newPartial+'_'
    // }
    // this.setState( {fullEasyAnswer: this.props.game.currentImage.bone.nameLatin,partialEasyAnswer: newPartial})
    
  }
  
  /**
   * This method measures the "correctness" (or similarity) of the answer string compared to the actual latin name string.
   * The similarity is scaled from 0 to 100, with 100 being a 100 % correct answer.
   * This method should probably be developed further, perhaps with similarity being measured on a word-to-word basis rather than as a full string.
   * Also, disregarding case is not proper, as the latin names ARE case-sensitive.
   */
  checkCorrectness() {
    return 100 * StringSimilarity.compareTwoStrings(this.props.game.currentImage.bone.nameLatin.toLowerCase(), this.state.value.toLowerCase()); // calculate similarity   
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
      if (this.state.partialEasyAnswer.length<3) {
        skipState =true
      }

      if (this.getRandomInt(0,25)<1+this.props.game.gameClock/400 && this.props.game.gameClock-this.state.previousRevealClock>7) {
        console.log('päästiin arvontaan')
        let randomIndex = this.getRandomInt(0,this.props.game.currentImage.bone.nameLatin.length);
        let newPartial = ''
        let addPenalty = 0.0
        for (var i = 0; i< this.props.game.currentImage.bone.nameLatin.length; i++) {
          if (i===randomIndex || this.props.game.currentImage.bone.nameLatin.charAt(i)===' ') {
          newPartial = newPartial+this.props.game.currentImage.bone.nameLatin.charAt(i)
          if (!skipState) {
            if (this.state.partialEasyAnswer.charAt(i)==='_') {
          addPenalty = 2.0/(this.props.game.currentImage.bone.nameLatin.length/2)
            }
          }
        } else if (!skipState) {
              newPartial = newPartial+this.state.partialEasyAnswer.charAt(i)
        } else {
          newPartial = newPartial+'_'
        }
        
        
     //   newPartial[randomIndex] =this.props.game.currentImage.bone.nameLatin[randomIndex]
        this.setState( { previousRevealClock: this.props.game.gameClock, partialEasyAnswer: newPartial, easyDifficultyPenalty: this.state.easyDifficultyPenalty+addPenalty})
        console.log('new partial on nyt : '+newPartial)
        }

      }
  }

  /**
   * Notice that the bone images are fethched from Cloudinary, with a resize transformation done based on the measured window size.
   */
  render() {

    if (this.props.game.gameClock>60 && this.props.game.gameDifficulty==='easy') {
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
      return Math.round(windowWidth*0.7)
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
      return Math.round(windowHeight*0.7)
    }

    let attempts = this.props.game.currentImage.attempts
    let correctAttempts = this.props.game.currentImage.correctAttempts
    let correctPercentile = Math.round(100 * (correctAttempts / attempts))
    if (isNaN(correctPercentile) || correctPercentile < 0) { correctPercentile = 0 }
    
    //{/* <Transformation width={imageWidth()} crop="fill" format="png" radius="20" /> */}
      //            {/* <Transformation width={imageWidth()} crop="fill" format="png" radius="20" /> */}

    let cheat = ''
    if (this.props.game.gameDifficulty==='easy') {
      cheat = this.state.partialEasyAnswer
    } else {
      cheat = '(Oikea vastaus: '+this.props.game.currentImage.bone.nameLatin
    }

    return (
      <div className="bottom">
        <div className="row" id="image-holder">
          <div className="intro">
            <CloudinaryContext cloudName="luupeli">
              <div className="height-restricted" >
                <Image id="bone-image" publicId={this.props.game.currentImage.url}     sizes="(min-width: 30em) 30em, 80vw">
                  
                </Image>
              </div>
            </CloudinaryContext>
          </div>
        </div>
        <div className="row">
          <div><center>
            <h3 id="heading">{this.props.game.currentImage.bone.name}</h3></center>
          </div>
        </div>
        {/* <div className="container">
          <div className="col-md-6 col-md-offset-3" id="info">
             */}
            <p>{this.props.game.currentImage.bone.description}</p>
            {/* <p>Tätä kuvaa on yritetty {attempts} kertaa, niistä {correctAttempts} oikein. Oikeita vastauksia: {correctPercentile} % kaikista yrityksistä.</p> */}
            <p>Img width: {imageWidth()} | height: {imageHeight()}</p>
            <p>URL: {this.props.game.currentImage.url}</p>
            <p>{cheat}</p>
          {/* </div>
        </div>
         */}
            <div className="game-answer-input"/>
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

const ConnectedWritingGame = connect(
  mapStateToProps,
  mapDispatchToProps
)(WritingGame)
export default ConnectedWritingGame
