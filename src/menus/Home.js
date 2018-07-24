import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import '../styles/App.css'
import '../styles/Crt.css'
import skelly from '../skelly'
import { injectGlobal } from 'styled-components'
import { Grid, Row, Col } from 'react-bootstrap'

/**
 * This is the index page for the site. You can for example login from here or start creating the game.
 * 
 */

class Home extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      //these are css style settings which are hopefully in a different place in the future
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
        overlay: null,
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

    //The method sets the first style as default if none are chosen.
    //This occurs when you open the page for the first time
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

  //If someone is logged in he will be set in the state as the user
  componentDidMount() {
    const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
    }
  }

  //This event chooses the next css style settings from the list
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
    window.onunload = function () { window.location.href = '/' }
  }

  proceedToSelect(event) {
    if (event.target.id === 'proceedToSelectGameMode') {
      this.setState({ redirect: true, redirectTo: '/gamemode' })
    } else if (event.target.id === 'homeMenuLoginButton') {
      this.setState({ redirect: true, redirectTo: '/login' })
    } else if (event.target.id === 'homeMenuSignUpButton') {
      this.setState({ redirect: true, redirectTo: '/register' })
    } else if (event.target.id === 'adminPageButton') {
      this.setState({ redirect: true, redirectTo: '/admin' })
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

  //this will view the login buttons if not logged in.
  //if logged in you will see logout button.
  //if logged in as an admin you will see a button for admin tools
  loggedInButtons() {
    if (this.state.user === null) {
      return (
        <div>
          <Row className="show-grid">
            <Col>
              <button
                id="homeMenuLoginButton"
                className="menu-button"
                onClick={this.proceedToSelect}>
                Kirjaudu sisään
              </button>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col>
              <button
                id="homeMenuSignUpButton"
                className="menu-button"
                onClick={this.proceedToSelect}>
                Luo käyttäjätili
              </button>
            </Col>
          </Row>
        </div>
      )
    } else if (this.state.user.role.toUpperCase() === 'ADMIN') {
      return (
        <div>
          <Row className="show-grid">
            <Col>
              <button
                id="adminPageButton"
                className="menu-button"
                onClick={this.proceedToSelect}>
                Ylläpitäjälle
              </button>
            </Col>
          </Row>
          {this.logOutButton()}
        </div>
      )
    } else {
      return (
        <div>
          {this.logOutButton()}
        </div>
      )
    }
  }

  //by pressing this you will trigger logout event
  logOutButton() {
    return (
      <div>
        <Row className="show-grid">
          <Col>
            <button
              className='menu-button'
              onClick={this.logOut}>
              Kirjaudu ulos
          </button>
          </Col>
        </Row>
      </div>
    )
  }

  //when logging out you will be removed from the sessionstorage
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
    //skelly()
    console.log(localStorage.getItem("allStyles"))
    //if redirect-boolean you will be redirect to the path that is pointed in state
    if (this.state.redirect) {
      this.setState({ redirect: false })
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

    //this index will pick the proper style from style list
    let i = parseInt(localStorage.getItem('styleIndex'))
    this.setThemeColors(i)

    return (
      <div id="homeMenu" className="App">
        <div className={this.state.overlay}>
          <div className={this.state.background}>
            <div id="styleName" className={this.state.style}>
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
              <h1 className="game-title">Luupeli</h1>
              <Row className="show-grid">
                <Col xs={10} xsOffset={1} md={4} sm={4} mdOffset={4} smOffset={4}>
                  <Row className="show-grid">
                    <Col>
                      <button
                        className="menu-button gamelink"
                        id="proceedToSelectGameMode"
                        onClick={this.proceedToSelect}>
                        Pelaa
                       </button>
                    </Col>
                  </Row>
                  {this.loggedInButtons()}
                  <Row className="show-grid">
                    <button
                      id="themeChangeButton"
                      className="menu-button"
                      onClick={this.changeCss}>
                      Vaihda teema
                    </button>
                  </Row>
                  <p>
                    Teema: {this.state.style}
                  </p>
                  <div className={this.state.style} />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Home
