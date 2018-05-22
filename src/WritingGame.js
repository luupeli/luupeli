import React, { Component } from 'react';

class WritingGame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      counter: 0,
      correctVisible: false,
      wrongVisible: false,
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
    event.target.reset()
    event.preventDefault();
  }

  //Checks if the answer is correct, and shows&hides the proper message after that.
  checkCorrectness() {
    if (this.state.images[this.state.counter].name.toLowerCase() == this.state.value.toLowerCase()) {
      //copypaste..
      this.setState({ correctVisible: true })
      setTimeout(() => {
        this.setState({ correctVisible: false });
      }, 5000);
    } else {
      this.setState({ wrongVisible: true })
      setTimeout(() => {
        this.setState({ wrongVisible: false });
      }, 5000);
    }
  }
  
  //looppaa
  changeCounter() {
    if (this.state.counter == this.state.images.length - 1) {
      this.setState({ counter : 0})
    } else {
      this.setState({ counter: this.state.counter + 1})
    }
  }

  previousIndex() {
    if (this.state.counter == 0) {
      return this.state.images.length - 1
    }
    return this.state.counter - 1
  }

  render() {  

    return (
      <div className="App">
        <div class="container">
          <div>
          {this.state.correctVisible && <div class="alert alert-success" role="alert">
                                          <p>Oikein!</p>
                                        </div>}
          {this.state.wrongVisible && <div class="alert alert-danger" role="alert"
                                        ><p>Väärin! Oikea vastaus oli 
                                        { " " }{this.state.images[this.previousIndex()].name.toLowerCase()}</p>
                                      </div>}
          </div>
          <div class="row">
            <div class="col-md-12">
            <img id="question-image" src={this.state.images[this.state.counter].src} /></div>
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
