import React from 'react'
import WGMessage from './WGMessage'

class WritingGame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      index: 0,
      images:  [
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
        }
      ]
    };

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({value: event.target.value})
  }

  handleSubmit(event) {
    this.wgmessage.mountTimer()
    this.checkCorrectness()
    this.changeCounter()
    event.preventDefault()
  }

  //Checks if the answer is correct, and shows&hides the proper message after that.
  checkCorrectness() {
    if (this.state.images[this.state.index].name.toLowerCase() === this.state.value.toLowerCase()) {
      //copypaste..
      this.setState({ correctVisible: true })
      this.wgmessage.setMessage('Oikein!')
    } else {
      this.setState({ wrongVisible: true })
      this.wgmessage.setMessage('Väärin! Oikea vastaus oli ' + this.state.images[this.state.index].name.toLowerCase())
    }
  }
  
  //method causes the game to loop 4ever
  changeCounter() {
    if (this.state.index === this.state.images.length - 1) {
      this.setState({ index : 0})
    } else {
      this.setState({ index: this.state.index + 1})
    }
  }

  //Method returns the index of previous image. Rework when looping is removed!
  previousIndex() {
    if (this.state.index === 0) {
      return this.state.images.length - 1
    }
    return this.state.index - 1
  }

  render() {
    return (
      <div className="App">
        <div class="container">
          <div>
            <WGMessage ref={instance => this.wgmessage = instance}/>
          </div>
          <div class="row">
            <div class="col-md-12">
              <img id="question-image" alt='Pelottava luuranko' src={this.state.images[this.state.index].src} /></div>
            </div>
          <div class="text">
            <p>Syötä luun nimi</p>
          </div>
          <div class="row">
            <div class="col-md-12">
              <form onSubmit={this.handleSubmit}>
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