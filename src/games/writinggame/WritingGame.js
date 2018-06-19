import { Redirect } from 'react-router-dom'
import React from 'react'
import WGMessage from './WGMessage'
import StringSimilarity from 'string-similarity'



class WritingGame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      testiviesti: props.location.state.testiviesti,
      value: '',
      index: 0,
      correct: 0,
      images: props.location.state.images,
      allBodyParts: props.location.state.allBodyParts,  // This is an array of all the known bodyparts.
      allAnimals: props.location.state.allAnimals       // This is an array of all the known animals.
    };
    console.log(this.state.testiviesti)
    console.log(this.state.images)
    console.log(this.state.allBodyParts)
    console.log(this.state.allAnimals)
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
    document.getElementById("progbar").style.width = (this.state.index+1)/this.state.images.length*100 + "%";
  }


  /**
    * Checks if the answer is correct, increments correct counter if needed and shows&hides the proper message after that.
    * If the answer is close enough, then a point (or perhaps a fraction of a point?) will be awarded.
    * https://www.npmjs.com/package/string-similarity ---- To install string-similarity:
    * npm install string-similarity --save 
    * Note for further development: the 'string-similarity' could also be used to gauge case-correctiveness of Latin names. Case is NOT irrelevant! 
   */
  checkCorrectness() {

    var similarity = StringSimilarity.compareTwoStrings(this.state.images[this.state.index].bone.nameLatin.toLowerCase(), this.state.value.toLowerCase()); // calculate similarity

    if (this.state.images[this.state.index].bone.nameLatin.toLowerCase() === this.state.value.toLowerCase()) {
      //copypaste..
      this.wgmessage.setMessage('Oikein!')
      this.setState({ correct: this.state.correct + 1 })
    } else if (similarity > 0.7) {    // if answer is similar enough 
      this.wgmessage.setMessage('Melkein oikein (similarity: ' + similarity.toPrecision(2) + '). Vastasit: ' + this.state.value.toLowerCase() + '. Oikea vastaus oli ' + this.state.images[this.state.index].bone.nameLatin.toLowerCase())
      this.setState({ correct: this.state.correct + 1 })
    } else {
      this.wgmessage.setMessage('Väärin (similarity: ' + similarity.toPrecision(2) + ')! Oikea vastaus oli ' + this.state.images[this.state.index].bone.nameLatin.toLowerCase())
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
      this.wgmessage.componentWillUnmount()
      return (
        <Redirect to={{
          pathname: "/endscreen",
          state: {
            correct: this.state.correct,
            total: this.state.images.length
          }
        }} />
      )
    }

    let bp = this.state.images[this.state.index].bone.bodypart; // The database id of the bodypart to which he bone in question is related to. 
    let bpname = "jotain";

    // Here we simply fetch the name of the bodypart to which the bone in question is related to. 
    // The for-loop should probably be converted into a key-loop (.length style loops seem to work a bit unrealiably, when dealing with strings...)
    for (var i = 0; i < this.state.allBodyParts.length; i++) {
      if (this.state.allBodyParts[i].id === bp) {
        console.log("bodypart match found!");
        bpname = this.state.allBodyParts[i].name;
      }

    }


    return (
      <div className="App">
        <p>{this.state.testiviesti}</p>
        <div>
          <div class="container">
            <div class="row">
              <div class="col-md-6 col-md-offset-3">
                <div class="progress">
                  <div class="progress-bar" id="progbar" aria-valuenow={this.state.index} aria-valuemin="0" aria-valuemax={this.state.images.length}><p id="proglabel">{this.state.index + 1}/{this.state.images.length}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      <div class="dual-layout">
        <div class="container">
          <div>
            <WGMessage ref={instance => this.wgmessage = instance} />
          </div>
          <div class="row" id="image-holder">
            <div class="intro">
                <img id="question-image" class="img-fluid" alt={this.state.images[this.state.index].bone.nameLatin+' osasta '+bpname+' kuvan url: http://luupeli-backend.herokuapp.com/images/' + this.state.images[this.state.index].url} src={'http://luupeli-backend.herokuapp.com/images/' + this.state.images[this.state.index].url} />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col-md-offset-3">
              <h1 id="heading">{this.state.images[this.state.index].bone.name}</h1>
            </div>
          </div>
          <div class="container">
            <div class="col-md-6 col-md-offset-3" id="info">   
              <p>Tähän tulee lisätietoa luusta</p> 
            </div>
          </div>
          <div class="answer-input">
            <div class="container">
              <div class="intro"/>
              <form className="input" class="form-inline" id='gameForm' onSubmit={this.handleSubmit}>
                <div class="form-group"><input class="form-control" type="text" onChange={this.handleChange} /></div>
                <div class="form-group"><input type="submit" class="btn btn-primary" value="Vastaa" /></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default WritingGame