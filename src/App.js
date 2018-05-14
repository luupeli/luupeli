import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div class="container">
            <div class="row">
                <div class="col-md-12"><img id="question-image" src="mansikka.jpg" /></div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <form>
                        <input class="form-control" type="text" />
                    </form>
                    <button class="btn btn-default" type="button">Button</button>
                </div>
            </div>
        </div>
      </div>  
    );
  }
}

export default App;
