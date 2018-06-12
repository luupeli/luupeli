import { Redirect } from 'react-router-dom'
import React from 'react'
import WGMessage from './WGMessage'
import StringSimilarity from 'string-similarity'



class WritingGame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      index: 0,
      correct: 0,
      images: [
        {
          id: 1,
          name: "Mansikka",
          src: "mansikka.jpg"
        },
        {
          id: 2,
          name: "Mustikka",
          src: "mustikka.jpg"
        },
        {
          id: 3,
          name: "Kirsikka",
          src: "kirsikka.jpg"
        },
        {
          id: 4,
          name: "Persikka",
          src: "persikka.jpg"
        },
        {
          id: 5,
          name: "Omena",
          src: "omena.jpg"
        }
      ]
    };

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
    console.log(this.state.value)
  }

  handleSubmit(event) {
    this.wgmessage.mountTimer()
    this.checkCorrectness()
    this.changeCounter()
    this.clearTextField()
    event.preventDefault()
  }

  //Checks if the answer is correct, increments correct counter if needed and shows&hides the proper message after that.
  //If the answer is close enough, then a point (or perhaps a fraction of a point?) will be awarded.

  //https://www.npmjs.com/package/string-similarity ---- To install string-similarity:
  //npm install string-similarity --save 

  //Note for further development: the 'string-similarity' could also be used to gauge case-correctiveness of Latin names. Case is NOT irrelevant!

  checkCorrectness() {

    var similarity = StringSimilarity.compareTwoStrings(this.state.images[this.state.index].name.toLowerCase(), this.state.value.toLowerCase()); // calculate similarity

    if (this.state.images[this.state.index].name.toLowerCase() === this.state.value.toLowerCase()) {
      //copypaste..
      this.wgmessage.setMessage('Oikein!')
      this.setState({ correct: this.state.correct + 1 })
    } else if (similarity > 0.8) {    // if answer is similar enough 
      this.wgmessage.setMessage('Melkein oikein (similarity: ' + similarity.toPrecision(2) + '). Vastasit: ' + this.state.value.toLowerCase() + '. Oikea vastaus oli ' + this.state.images[this.state.index].name.toLowerCase())
      this.setState({ correct: this.state.correct + 1 })
    } else {
      this.wgmessage.setMessage('Väärin! Vastasit: ' + this.state.value.toLowerCase() + ' (similarity: ' + similarity.toPrecision(2) + '). Oikea vastaus oli ' + this.state.images[this.state.index].name.toLowerCase())
    }
  }

  //If all images have not yet been cycled through, increment counter by 1
  changeCounter() {
    if (this.state.index <= this.state.images.length) {
      this.setState({ index: this.state.index + 1 })
    }
  }

  //clears text field, sets text field value to empty string
  clearTextField() {
    document.getElementById('gameForm').reset()
    this.setState({ value: '' })
  }

  //Method returns the index of previous image.
  previousIndex() {
    return this.state.counter - 1
  }

  //Returns the state
  state() {
    return this.state
  }

  //If all images have been cycled through, redirect to endscreen, otherwise render quiz page
  render() {
    if (this.state.index >= this.state.images.length) {
      return (
        <div>
          <Redirect to={{
            pathname: "/endscreen",
            state: {
              correct: this.state.correct,
              total: this.state.images.length
            }
          }} />
        </div>
      )
      this.wgmessage.componentWillUnmount()
    }

    return (
      <div className="App">
        <div class="container">
          <div>
            <WGMessage ref={instance => this.wgmessage = instance} />
          </div>
          <div class="row">
            <div class="col-md-12">
              <img id="question-image" alt='Pelottava luuranko' src={this.state.images[this.state.index].src} /></div>
          </div>
          <div className="title">
            <p>Syötä luun nimi</p>
          </div>
          <div class="row">
            <div class="col-md-12">
              <form className="input" id='gameForm' onSubmit={this.handleSubmit}>
                <input class="form-control" type="text" onChange={this.handleChange} />
                <input type="submit" value="Vastaa" />
                <p>{this.state.index + 1}/{this.state.images.length}</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WritingGame
