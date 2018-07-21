import React from 'react'
import StringSimilarity from 'string-similarity'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { setAnswer } from '../reducers/gameReducer'
import { setMessage } from '../reducers/messageReducer'
import { connect } from 'react-redux'

class WritingGame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: ''
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
    this.setState({ value: '' })
    this.props.setAnswer(this.props.currentImage, this.checkCorrectness(), this.state.value)
    this.createMessage()
  }

  checkCorrectness() {
    return 100 * StringSimilarity.compareTwoStrings(this.props.currentImage.bone.nameLatin.toLowerCase(), this.state.value.toLowerCase()); // calculate similarity   
  }

  createMessage() {
    const similarity = this.checkCorrectness()

    if (this.props.currentImage.bone.nameLatin.toLowerCase() === this.state.value.toLowerCase()) {
      this.props.setMessage('Oikein!', 'success')
    } else if (similarity > 70) {
      this.props.setMessage('Melkein oikein (similarity: ' + similarity.toPrecision(2) + '). Vastasit: ' + this.state.value.toLowerCase() + '. Oikea vastaus oli ' + this.props.currentImage.bone.nameLatin.toLowerCase(), 'warning')
    } else {
      this.props.setMessage('Väärin (similarity: ' + similarity.toPrecision(2) + ')! Oikea vastaus oli ' + this.props.currentImage.bone.nameLatin.toLowerCase(), 'danger')
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
            <p>{this.props.currentImage.bone.description}</p>
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
  setMessage
}

const ConnectedWritingGame = connect(
  mapStateToProps,
  mapDispatchToProps
)(WritingGame)
export default ConnectedWritingGame
