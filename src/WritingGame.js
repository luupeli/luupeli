import React, { Component } from 'react';

class WritingGame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      counter: 0,
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

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    this.checkCorrectness();
    this.changeCounter();

    event.preventDefault();
  }

  checkCorrectness() {
    if (this.state.images[this.state.counter].name.toLowerCase() == this.state.value.toLowerCase()) {
      alert('Oikein!');
    } else {
      alert('Väärin!')
    }
  }
  
  changeCounter() {
    if (this.state.counter == this.state.images.length - 1) {
      this.setState({ counter : 0})
    } else {
      this.setState({ counter: this.state.counter + 1})
    }
  }
  
  render() {
    return (
      <div className="App">
        <div class="container">
          <div class="row">
            <div class="col-md-12"><img id="question-image" src={this.state.images[this.state.counter].src} /></div>
          </div>
          <div class="text">
            <p>Syötä luun nimi</p>
          </div>
          <div class="row">
            <div class="col-md-12">
              <form onSubmit={this.handleSubmit}>
                <input class="form-control" type="text" onChange={this.handleChange} />
                <input type="submit" value="Vastaa" />
                <p>{this.state.counter + 1}/{this.state.images.length}</p>
              </form>
            </div>
          </div>
        </div>
      </div>  
    );
  }
}

export default WritingGame;
