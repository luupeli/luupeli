import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import '../styles/App.css'
import '../styles/Crt.css'
import { injectGlobal } from 'styled-components'

class Home extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      allStyles: [{
        style: 'blood-dragon',
        background: 'background-blood-dragon',
        flairLayerD: 'grid-sub',
        flairLayerC: 'grid',
        flairLayerB: 'grid-flair',
        flairLayerA: 'blinder',
        primary: '#ff5db1',
        secondary: '#ff2596',
        tertiary: '#ef007c',
        overlay: null
      }, {
        style: 'fallout',
        background: 'background-fallout',
        flairLayerD: 'none',
        flairLayerC: 'none',
        flairLayerB: 'none',
        flairLayerA: 'none',
        primary: '#33BB33',
        secondary: '#229922',
        tertiary: '#115511',
        overlay: 'crt'
      }, {
        style: 'deep-blue',
        background: 'background-deep-blue',
        flairLayerD: 'none',
        flairLayerC: 'none',
        flairLayerB: 'none',
        flairLayerA: 'none',
        primary: '#0033BB',
        secondary: '#002299',
        tertiary: '#000055',
        overlay: null
      }, {
        style: 'steel',
        background: 'background-steel',
        flairLayerD: 'none',
        flairLayerC: 'none',
        flairLayerB: 'none',
        flairLayerA: 'none',
        primary: '#BBBBFF',
        secondary: '9999DD',
        tertiary: '#555599',
        overlay: null
      }],
      styleIndex: 0,
      style: 'blood-dragon',
      background: 'background-blood-dragon',
      flairLayerD: 'grid-sub',
      flairLayerC: 'grid',
      flairLayerB: 'grid-flair',
      flairLayerA: 'blinder',
      primary: '#ff5db1',
      secondary: '#ff2596',
      tertiary: '#ef007c',
      overlay: null,
      user: null
    }

    if (localStorage.getItem('styleIndex') === null) {
      localStorage.setItem('styleIndex', 0)
    }

    localStorage.setItem('allStyles', JSON.stringify(this.state.allStyles))   // Array must be converted to JSON before storing it into localStorage!
    this.setState({
      styleIndex: 0,
    })
    this.changeCss = this.changeCss.bind(this)
    this.proceedToSelect = this.proceedToSelect.bind(this)
    this.setThemeColors = this.setThemeColors.bind(this)
  }

  componentDidMount() {
    const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
    }
  }

  changeCss(event) {
    var next = parseInt(localStorage.getItem('styleIndex')) + 1

    if (this.state.allStyles[next] != null) {
      localStorage.setItem('styleIndex', next)
      this.setState({
        styleIndex: next,
        style: 'placeholder-next-theme-name'
      })
    } else {
      localStorage.setItem('styleIndex', 0)
      this.setState({
        styleIndex: 0,
        style: 'placeholder-last-theme-name'
      })
      next = 0
    }
    console.log('new style index is now: ' + next)
    window.location.reload()
  }

  proceedToSelect(event) {
    this.setState({ redirect: true })
    if (event.target.className === 'gamelink') {
      this.setState({ redirectTo: '/game' })
    } else if (event.target.className === 'loginlink') {
      this.setState({ redirectTo: '/login' })
    } else if (event.target.className === 'signuplink') {
      this.setState({ redirectTo: '/register' })
    }
  }

  setThemeColors(i) {

    injectGlobal`
    :root {      
      --primary: ${this.state.primary}
      --secondary: ${this.state.secondary}
      --tertiary: ${this.state.tertiary}
      }
    }`

    if (this.state.styleIndex != localStorage.styleIndex && this.state.allStyles[localStorage.styleIndex] !== undefined) {
      this.setState({
        styleIndex: localStorage.styleIndex,
        style: this.state.allStyles[localStorage.styleIndex].style,
        background: this.state.allStyles[localStorage.styleIndex].background,
        flairLayerD: this.state.allStyles[localStorage.styleIndex].flairLayerD,
        flairLayerC: this.state.allStyles[localStorage.styleIndex].flairLayerC,
        flairLayerB: this.state.allStyles[localStorage.styleIndex].flairLayerB,
        flairLayerA: this.state.allStyles[localStorage.styleIndex].flairLayerA,
        primary: this.state.allStyles[localStorage.styleIndex].primary,
        secondary: this.state.allStyles[localStorage.styleIndex].secondary,
        tertiary: this.state.allStyles[localStorage.styleIndex].tertiary,
        overlay: this.state.allStyles[localStorage.styleIndex].overlay
      })
    }
  }

  loggedInButtons() {
    if (this.state.user === null) {
      return (
        <div>
          <button
            className="loginlink"
            onClick={this.proceedToSelect}
          >
            Kirjaudu sisään
          </button>
          <button
            className="signuplink"
            onClick={this.proceedToSelect}
          >
            Luo käyttäjätili
          </button>
        </div>
      )
    } else {
      return (
        <div>
          <button onClick={this.logOut}>
            Kirjaudu ulos
          </button>
        </div>
      )
    }
  }

  logOut = async (event) => {
    event.preventDefault()
    try {
      window.sessionStorage.removeItem('loggedLohjanLuunkeraajaUser')
      this.setState({ user: null })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    console.log(localStorage.getItem("allStyles"))
    if (this.state.redirect) {
      return (
        <Redirect to=
          {
            {
              pathname: this.state.redirectTo,
              state: {
                allStyles: this.state.allStyles,
                styleIndex: this.state.styleIndex
              }
            }
          }
        />
      )
    }

    let i = parseInt(localStorage.getItem('styleIndex'))
    this.setThemeColors(i)

    return (
      <div className={this.state.overlay}>
        <div className={this.state.background}>
          <div className={this.state.style}>
            <div className="App">
              <div
                className={this.state.flairLayerA}>
              </div>
              <div
                className={this.state.flairLayerB}>
              </div>
              <div
                className={this.state.flairLayerC}>
              </div>
              <div
                className={this.state.flairLayerD}>
              </div>
              <h1 className="gametitle">Luupeli</h1>
              <div id="btn-group" className="btn-group">
                <button
                  className="gamelink"
                  onClick={this.proceedToSelect}>
                  Pelaa
                </button>
                {this.loggedInButtons()}
                <button
                  className="theme"
                  onClick={this.changeCss}>
                  Vaihda teema
                </button>
                <p>
                  Teema: {this.state.style}
                </p>
                <div className={this.state.style} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Home
