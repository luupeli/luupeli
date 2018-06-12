import { Redirect } from 'react-router-dom'
import React from 'react'
import WGMessage from './WGMessage'

class WritingGame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      testiviesti: props.location.state.testiviesti,
      value: '',
      index: 0,
      correct: 0,
      images: props.location.state.images
    };
    console.log(this.state.testiviesti)
    console.log(this.state.images)
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
  checkCorrectness() {
    if (this.state.images[this.state.index].url.toLowerCase() === this.state.value.toLowerCase()) {
      //copypaste..
      this.wgmessage.setMessage('Oikein!')
      this.setState({ correct: this.state.correct + 1 })
    } else {
      this.wgmessage.setMessage('Väärin! Oikea vastaus oli ' + this.state.images[this.state.index].url.toLowerCase())
    }
  }
  
  //If all images have not yet been cycled through, increment counter by 1
  changeCounter() {
    if (this.state.index <= this.state.images.length) {
      this.setState({ index: this.state.index + 1})
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
		
    return (
      <div className="App">
      <p>{this.state.testiviesti}</p>
        <div class="container">
          <div>
            <WGMessage ref={instance => this.wgmessage = instance}/>
          </div>
          <div class="row">
            <div class="col-md-12">
              <img id="question-image" alt='Pelottava luuranko' src={this.state.images[this.state.index].url} /></div>
            </div>
          <div className="title">
            <p>Syötä luun nimi</p>
          </div>
          <div class="row">
            <div class="col-md-12">
              <form id='gameForm' onSubmit={this.handleSubmit}>
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
