import React from 'react'
import StringSimilarity from 'string-similarity'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { setAnswer,setLocalStats } from '../reducers/gameReducer'
import { setMessage } from '../reducers/messageReducer'
import { connect } from 'react-redux'
import imageService from '../services/images'


class WritingGame extends React.Component {

  constructor(props) {
    super(props);
    this.timer = 0;
    this.state = {
      value: '',
      seconds: 0.0,
      secondsTotal: 0.0,
      counter: 0,
      //answers: [{nameLatin:null, youtAnswer: null, correctness:null, time:null}]
  //    answers: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    
    
  }



  handleChange(event) {
    this.setState({ value: event.target.value })
    console.log(this.state.value)
  }

  handleSubmit (event) {
    event.preventDefault()

    let correctness = 'Oikein'
    let points = Math.round((this.checkCorrectness()*10)/this.state.seconds)
    if (this.checkCorrectness()>99) {
      points=points*2
    } else if (this.checkCorrectness()>95) {
      points=points*1.25
    }

    if (this.checkCorrectness()<1.0) {
      correctness = 'Väärin'
      points=0
    }
    

    this.props.setLocalStats(this.props.currentImage.bone.nameLatin,this.state.value,correctness,this.state.seconds,this.state.secondsTotal, points)

    this.setState({ value: '' })
    this.props.setAnswer(this.props.currentImage, this.checkCorrectness(), this.state.value)


    this.createMessage()
  }

  tick() {
    this.setState(prevState => ({
      seconds:  prevState.seconds + 1,
      secondsTotal: prevState.secondsTotal + 1
    }));
  }

  componentWillMount(){
    
    this.interval = setInterval(() => this.tick(), 100);
}

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  checkCorrectness() {
    return 100 * StringSimilarity.compareTwoStrings(this.props.currentImage.bone.nameLatin.toLowerCase(), this.state.value.toLowerCase()); // calculate similarity   
  }

  createMessage() {
    const similarity = this.checkCorrectness()

    if (this.props.currentImage.bone.nameLatin.toLowerCase() === this.state.value.toLowerCase()) {
      this.props.setMessage('Oikein!', 'success')
      
      this.setState({
      //  answers: [...this.state.answers, [{nameLatin: this.props.currentImage.bone.nameLatin,correctness: 'Oikein',time: this.state.seconds }]],
        seconds: 0.0
        
      })
      
      
    } else if (similarity > 70) {
      this.props.setMessage('Melkein oikein (similarity: ' + similarity.toPrecision(2) + '). Vastasit: ' + this.state.value.toLowerCase() + '. Oikea vastaus oli ' + this.props.currentImage.bone.nameLatin.toLowerCase(), 'warning')
    } else {
      this.props.setMessage('Väärin (similarity: ' + similarity.toPrecision(2) + ')! Oikea vastaus oli ' + this.props.currentImage.bone.nameLatin.toLowerCase(), 'danger')
      
      this.setState({
      //  answers: [...this.state.answers, [{nameLatin: this.props.currentImage.bone.nameLatin,correctness: 'Väärin',time: this.state.seconds }]],
        seconds: 0.0
        
      })
    }
    console.log(this.state)
    
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

    let attempts = this.props.currentImage.attempts
    let correctAttempts = this.props.currentImage.correctAttempts
    let correctPercentile = Math.round(100*(correctAttempts/attempts))
    if (correctPercentile===NaN || correctPercentile<0) {correctPercentile = 0}

    return (
      <div class="bottom">
        <div class="row" id="image-holder">
          <div class="intro">
            <CloudinaryContext cloudName="luupeli">
              <div>
                <Image publicId={this.props.currentImage.url}>
                  <Transformation width={imageWidth()} crop="fill" radius="20" />
                </Image>
              </div>
            </CloudinaryContext>
          </div>
        </div>
        <div class="row">
          <div><center>
            <h3 id="heading">{this.props.currentImage.bone.name}</h3></center>
          </div>
        </div>
        <div class="container">
          <div class="col-md-6 col-md-offset-3" id="info">
          <h6>Vastausaikaa kulunut {Math.round(this.state.seconds/10,1)}</h6>
            <p>{this.props.currentImage.bone.description}</p>
            <p>Tätä kuvaa on yritetty {attempts} kertaa, niistä {correctAttempts} oikein. Oikeita vastauksia: {correctPercentile} % kaikista yrityksistä.</p>
            <p>(Oikea vastaus: {this.props.currentImage.bone.nameLatin})</p>
          </div>
        </div>
        <div class="answer-input">
          <div class="container">
            <div class="intro" />
            <form
              className="input"
              class="form-inline"
              id='gameForm'
              onSubmit={this.handleSubmit}
            >
              <div class="form-groupbd">
                <input
                  class="form-control"
                  id="gameTextInput"
                  type="text"
                  value={this.state.value}
                  onChange={this.handleChange}
                />
              </div>
              <div className={"btn-group" + this.state.style + " GameButton"}>
                <button type="submit" id="submitButton">Vastaa</button>
              </div>
            </form>
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
  setLocalStats,
  setMessage
}

const ConnectedWritingGame = connect(
  mapStateToProps,
  mapDispatchToProps
)(WritingGame)
export default ConnectedWritingGame
