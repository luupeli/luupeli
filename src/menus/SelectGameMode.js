import React from 'react'
import { Link } from 'react-router-dom'

class SelectGameMode extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      style: localStorage.getItem('style'),
      background: localStorage.getItem('background'),
      flairLayerD: localStorage.getItem('flairLayerD'),
      flairLayerC: localStorage.getItem('flairLayerC'),
      flairLayerB: localStorage.getItem('flairLayerB'),
      flairLayerA: localStorage.getItem('flairLayerA'),
      primary: localStorage.getItem('primary'),
      secondary: localStorage.getItem('secondary'),
      tertiary: localStorage.getItem('tertiary')
    }
  }

  render() {

    return (
      <div>
      <div className={this.state.background}>
      <div className={this.state.style}> 

   <div className="App">
          <div className={this.state.flairLayerA}>
          </div>
          <div className={this.state.flairLayerB}>
          </div>
          <div className={this.state.flairLayerC}>
          </div>
          <div className={this.state.flairLayerD}>
          </div>
          <h2 className="toprow">Valitse</h2>
          <h2 className="secondrow">Luupelimuoto:</h2>
          <div className="btn-group">
            <Link to='/settings'><button className="writinggame">Kirjoituspeli</button></Link>
            <button>...</button>
            <button>...</button>
          </div>
        </div>
        <div className="App">
          <Link to='/'><button className="gobackbutton">Takaisin</button></Link>
          </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SelectGameMode