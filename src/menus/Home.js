import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/App.css';
import styled from 'styled-components';




class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = { 
      
      primary:'#ff5db1',
      secondary: '#ff2596',
      tertiary: '#ef007c'
  };

    if (localStorage.getItem('style') === null) {
      localStorage.setItem('style', 'blood-dragon')
      localStorage.setItem('background', 'background-blood-dragon')
      localStorage.setItem('flairLayerD', 'grid-sub')
      localStorage.setItem('flairLayerC', 'grid')
      localStorage.setItem('flairLayerB', 'grid-flair')
      localStorage.setItem('flairLayerA', 'blinder')
      localStorage.setItem('primary', '#ff5db1')
      localStorage.setItem('secondary', '#ff2596')
      localStorage.setItem('tertiary', '#ef007c')

    }
    this.state = {
      //style is fetched from localstorage
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
    this.changeCss = this.changeCss.bind(this)
  }

  //Temporary solution, changes css to "bl" (blank, doesn't exist), otherwise to "bd" (the main theme). Changing body doesn't work currently.
  changeCss(event) {
    if (this.state.style === 'deep-blue') {
      localStorage.setItem('style', 'blood-dragon')
      localStorage.setItem('background', 'background-blood-dragon')
      localStorage.setItem('flairLayerD', 'grid-sub')
      localStorage.setItem('flairLayerC', 'grid')
      localStorage.setItem('flairLayerB', 'grid-flair')
      localStorage.setItem('flairLayerA', 'blinder')
      localStorage.setItem('primary', '#ff5db1')
      localStorage.setItem('secondary', '#ff2596')
      localStorage.setItem('tertiary', '#ef007c')
      
      document.body.style.color = "#ffffff"
      document.body.style.background = "#000000"
    } else {
      localStorage.setItem('style', 'deep-blue')
      localStorage.setItem('background', 'background-deep-blue')
      localStorage.setItem('flairLayerD', 'none')
      localStorage.setItem('flairLayerC', 'none')
      localStorage.setItem('flairLayerB', 'none')
      localStorage.setItem('flairLayerA', 'none')
      localStorage.setItem('primary', '#0033BB')
      localStorage.setItem('secondary', '#002299')
      localStorage.setItem('tertiary', '#000055')
      
      document.body.style.color = "#000000"
      document.body.style.background = "#ffffff"
    }
    this.setState({
      style: localStorage.getItem('style'),
      background: localStorage.getItem('background'),
      flairLayerD: localStorage.getItem('flairLayerD'),
      flairLayerC: localStorage.getItem('flairLayerC'),
      flairLayerB: localStorage.getItem('flairLayerB'),
      flairLayerA: localStorage.getItem('flairLayerA'),
      primary: localStorage.getItem('primary'),
      secondary: localStorage.getItem('secondary'),
      tertiary: localStorage.getItem('tertiary')
    })


    console.log(this.state.style)
    console.log(this.state)
    window.location.reload();
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
          <h1 className="gametitle">Luupeli</h1>
          <div className="btn-group">
            <Link className="gamelink" to='/game'><button>Pelaa</button></Link>
            <button >Kirjaudu sisään</button>
            <button>Luo käyttäjätili</button>
            <button onClick={this.changeCss}>Vaihda css</button>
          </div>
        </div>
        </div>
      </div>
      </div>
    )
  }
}
export default Home