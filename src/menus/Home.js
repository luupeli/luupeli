import React from 'react'
import { Redirect } from 'react-router-dom'
import '../styles/App.css'
import '../styles/Crt.css'
import skelly from '../skelly'
import { injectGlobal } from 'styled-components'
import { Row, Col } from 'react-bootstrap'
import RandomTextGenerator from 'react-scrolling-text';
import { Animated } from "react-animated-css";
import emoji from 'node-emoji'
import Sound from 'react-sound';

/**
 * This is the index page for the site. You can for example login from here or start creating the game.
 * 
 */

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // These are CSS style settings which are hopefully in a different place in the future
      allStyles: [{                             // KEY
        style: 'blood-dragon',                  // Name of the visual theme
        background: 'background-blood-dragon',  // reference to the css background styling
        flairLayerD: 'grid-sub',                // on top of the background, a visual style can use up to 4 layers ouf 'flair'
        flairLayerC: 'grid',                    // Layer D is the bottom most layer of flair, while layer A is the top most
        flairLayerB: 'grid-flair',              //
        flairLayerA: 'blinder',                 //
        highlight: '#ff9de1',                   // Each theme specficies four color codes. Highlight is mostly for the fonts.
        primary: '#ff5db1',                     // Primary is the second most brightest theme color
        secondary: '#ff2596',                   // Secondary is the middle color of the theme
        tertiary: '#ef007c',                    // Tertiary is the darkest color of the theme
        overlay: null,                          // Overlay can be used to add an extra layer of vfx on top of the viewport. Optional!
      }, {
        style: 'fallout',
        background: 'background-fallout',
        flairLayerD: 'none',
        flairLayerC: 'none',
        flairLayerB: 'none',
        flairLayerA: 'none',
        highlight: '#55DD55',
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
        highlight: '#5599FF',
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
        highlight: '#DFDFFF',
        primary: '#BBBBFF',
        secondary: '#9999DD',
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
      highlight: '#ff9de1',
      primary: '#ff5db1',
      secondary: '#ff2596',
      tertiary: '#ef007c',
      overlay: null,
      user: null,
      admin: false,
      attractMode: 0,
      attractAnimation:true
    }

    // The method sets the first style as default if none are chosen.
    // This occurs when you open the page for the first time
    if (localStorage.getItem('styleIndex') === null) {
      localStorage.setItem('styleIndex', 0)
    }

    localStorage.setItem('allStyles', JSON.stringify(this.state.allStyles))   // Array must be converted to JSON before storing it into localStorage!
    this.changeCss = this.changeCss.bind(this)
    this.proceedToSelect = this.proceedToSelect.bind(this)
    this.setThemeColors = this.setThemeColors.bind(this)
  }

  // If someone is logged in he will be set in the state as the user
  componentDidMount() {
    this.setState({
      styleIndex: 0,
    })

    const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
      if (user.role === "ADMIN") {
        this.setState({ admin: true })
      }
    }

  }
      /**
     * With the component mounting, the game time measuring tick() is set at 50 milliseconds.
     */
    componentWillMount() {

      this.interval = setInterval(() => this.tick(), 1000);
  }
  /**
   * At component unmount the interval needs to be cleared.
   */
  componentWillUnmount() {
      clearInterval(this.interval);
  }

  tick() {
    if (this.state.attractMode%20>16) {
      this.setState({attractMode:this.state.attractMode+1,attractAnimation:false})
    } else {
      this.setState({attractMode:this.state.attractMode+1,attractAnimation:true})

  }
  }
  

  

  // This event chooses the next css style settings from the list
  changeCss(event) {
    var next = parseInt(localStorage.getItem('styleIndex'), 10) + 1
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
    } else if (event.target.id === 'profilePageButton') {
      this.setState({ redirect: true, redirectTo: '/users/' + this.state.user.id })
    } else if (event.target.id === 'bestPlayers') {
      this.setState({ redirect: true, redirectTo: '/leaderboard' })
    }
  }

  setThemeColors(i) {

    injectGlobal`
    :root {   
      --highlight: ${this.state.highlight}   
      --primary: ${this.state.primary}
      --secondary: ${this.state.secondary}
      --tertiary: ${this.state.tertiary}
      }
    }`

    if (this.state.styleIndex !== localStorage.styleIndex && this.state.allStyles[localStorage.styleIndex] !== undefined) {
      this.setState({
        styleIndex: localStorage.styleIndex,
        style: this.state.allStyles[localStorage.styleIndex].style,
        background: this.state.allStyles[localStorage.styleIndex].background,
        flairLayerD: this.state.allStyles[localStorage.styleIndex].flairLayerD,
        flairLayerC: this.state.allStyles[localStorage.styleIndex].flairLayerC,
        flairLayerB: this.state.allStyles[localStorage.styleIndex].flairLayerB,
        flairLayerA: this.state.allStyles[localStorage.styleIndex].flairLayerA,
        highlight: this.state.allStyles[localStorage.styleIndex].highlight,
        primary: this.state.allStyles[localStorage.styleIndex].primary,
        secondary: this.state.allStyles[localStorage.styleIndex].secondary,
        tertiary: this.state.allStyles[localStorage.styleIndex].tertiary,
        overlay: this.state.allStyles[localStorage.styleIndex].overlay
      })
    }
  }

  adminButtons() {
    if (this.state.admin) {
      return (
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
      )
    } else if (this.state.user !== null) {
      return (
        <Row className="show-grid">
          <Col>
            <button
              id="profilePageButton"
              className="menu-button"
              onClick={this.proceedToSelect}>
              Profiili
            </button>
          </Col>
        </Row>
      )
    } else {
      return (
        <div>
        </div>
      )
    }
  }

  gameTitle() {

      if (this.state.style==='fallout') {
        return (
          <h1 className="game-title">
          <RandomTextGenerator
          charList={['é', 'ä', 'í', 'ƒ', 'ñ', '*', 'π', '[', ']', 'k', '¥', 'å']}
          text={'Luupeli'}
          interval={24}
          timePerChar={240}
          />
          </h1>
        )
      }
      else {
      return (
        <h1 className="game-title">Luupeli</h1>
      )
    }
  }

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
    } else {
      return (
        <div>
          <Row className="show-grid">
            <Col>
              <button
                id='logout-button'
                className='menu-button'
                onClick={this.logOut}>
                Kirjaudu ulos
              </button>
            </Col>
          </Row>
        </div>
      )
    }
  }

  // When logging out you will be removed from the sessionstorage
  logOut = async (event) => {
    event.preventDefault()
    try {
      window.sessionStorage.removeItem('loggedLohjanLuunkeraajaUser')
      this.setState({
        user: null,
        admin: false
      })
    } catch (error) {
      console.log(error)
    }
  }

  attractMode() {
    

    if (this.state.attractMode%60<20) {
      

      return (
        <div>
    <div className="home-highscore-top">
                
                <Animated animationIn="bounceInUp slower" animationOut="bounceOutRight faster" animationInDelay="1500" animationOutDelay="0" isVisible={this.state.attractAnimation}>
		            <h3>
			          TOP 10 LUUPÄÄT
		            </h3>
				      </Animated>
              </div>
              
              
              <Animated animationIn="bounceInUp slower" animationOut="bounceOutLeft faster" animationInDelay="2000"  animationOutDelay="50" isVisible={this.state.attractAnimation}>
              <div className="home-highscore">
              <div className="score">
                <h5>
			          1. Luu Skywalker
                </h5>
		            </div>
                <div className="score">
                  <h5>
                10 000
                  </h5>
                  </div>
                  </div>    
				      </Animated>
   
              <Animated animationIn="bounceInUp slower" animationOut="bounceOutRight faster" animationInDelay="2500" animationOutDelay="100" isVisible={this.state.attractAnimation}>
              <div className="home-highscore">
              <div className="score">
                <h5>
			          2. Luuno Turhapuro
                </h5>
		            </div>
                <div className="score">
                  <h5>
                9 000
                  </h5>
                  </div>
                  </div>    
				      </Animated>
              <Animated animationIn="bounceInUp slower" animationOut="bounceOutLeft faster" animationInDelay="3000" animationOutDelay="150" isVisible={this.state.attractAnimation}>
              <div className="home-highscore">
              <div className="score">
                <h5>
			          3. Princess Luua
                </h5>
		            </div>
                <div className="score">
                  <h5>
                7 500
                  </h5>
                  </div>
                  </div>    
				      </Animated>
              <Animated animationIn="bounceInUp slower" animationOut="bounceOutRight faster" animationInDelay="3500" animationOutDelay="200" isVisible={this.state.attractAnimation}>
              <div className="home-highscore">
              <div className="score">
                <h5>
			          4. Luuntietäjä
                </h5>
		            </div>
                <div className="score">
                  <h5>
                6 660
                  </h5>
                  </div>
                  </div>    
				      </Animated>
              <Animated animationIn="bounceInUp slower" animationOut="bounceOutLeft faster" animationInDelay="4000" animationOutDelay="250" isVisible={this.state.attractAnimation}>
              <div className="home-highscore">
              <div className="score">
                <h5>
			          5. Sorbusten ritari 
                </h5>
		            </div>
                <div className="score">
                  <h5>
                5 000
                  </h5>
                  </div>
                  </div>    
				      </Animated>
              <Animated animationIn="bounceInUp slower" animationOut="bounceOutRight faster"  animationInDelay="4500"  animationOutDelay="300" isVisible={this.state.attractAnimation}>
              <div className="home-highscore">
              <div className="score">
                <h5>
			          6. Keisari Luupatine
                </h5>
		            </div>
                <div className="score">
                  <h5>
                4 000
                  </h5>
                  </div>
                  </div>    
				      </Animated>
              <Animated animationIn="bounceInUp slower"  animationOut="bounceOutLeft faster" animationInDelay="5000"  animationOutDelay="350" isVisible={this.state.attractAnimation}>
              <div className="home-highscore">
              <div className="score">
                <h5>
			          7. Mr. Kitiini
                </h5>
		            </div>
                <div className="score">
                  <h5>
                3 000
                  </h5>
                  </div>
                  </div>    
				      </Animated>
              <Animated animationIn="bounceInUp slower"  animationOut="bounceOutRight faster" animationInDelay="5500"  animationOutDelay="400" isVisible={this.state.attractAnimation}>
              <div className="home-highscore">
              <div className="score">
                <h5>
			          8. Luufemma
                </h5>
		            </div>
                <div className="score">
                  <h5>
                2 500
                  </h5>
                  </div>
                  </div>    
				      </Animated>
              <Animated animationIn="bounceInUp slower"  animationOut="bounceOutLeft faster" animationInDelay="6000" animationOutDelay="450"  isVisible={this.state.attractAnimation}>
              <div className="home-highscore">
              <div className="score">
                <h5>
			          9. Luunkerääjä
                </h5>
		            </div>
                <div className="score">
                  <h5>
                1 500
                  </h5>
                  </div>
                  </div>    
				      </Animated>
              <Animated animationIn="bounceInUp slower" animationOut="bounceOutRight faster" animationInDelay="6500" animationOutDelay="500" isVisible={this.state.attractAnimation}>
              <div className="home-highscore">
              <div className="score">
                <h5>
			          10. Luubi-Wan Luunobi
                </h5>
		            </div>
                <div className="score">
                  <h5>
                1 000
                  </h5>
                  </div>
                  </div>    
				      </Animated>
              </div>
              )
    } 
    else if (this.state.attractMode%60<40) {
      

      let heartEmoji = emoji.get('yellow_heart')

      return (
        <div>
        <div className="home-highscore-top">
                
        <Animated animationIn="bounceInUp slower" animationOut="bounceOutLeft faster" animationInDelay="1500" animationOutDelay="0" isVisible={this.state.attractAnimation}>
        <h3>
        CREDITS
        </h3>
      </Animated>
      </div>
      <Animated animationIn="bounceInUp slower" animationOut="bounceOutRight faster" animationInDelay="2000"  animationOutDelay="50" isVisible={this.state.attractAnimation}>
      <div className="home-highscore">
      <div className="score">
        <h5>
        Helena Parviainen
        </h5>
        </div>
          </div>    
      </Animated>
      <Animated animationIn="bounceInUp slower" animationOut="bounceOutLeft faster" animationInDelay="2500"  animationOutDelay="100" isVisible={this.state.attractAnimation}>
      <div className="home-highscore">
      <div className="score">
        <h5>
        Kerem Atak
        </h5>
        </div>
          </div>    
      </Animated>
      <Animated animationIn="bounceInUp slower" animationOut="bounceOutRight faster" animationInDelay="3000"  animationOutDelay="150" isVisible={this.state.attractAnimation}>
      <div className="home-highscore">
      <div className="score">
        <h5>
        Peppi Mattsson
        </h5>
        </div>
          </div>    
      </Animated>
      <Animated animationIn="bounceInUp slower" animationOut="bounceOutLeft faster" animationInDelay="3500"  animationOutDelay="200" isVisible={this.state.attractAnimation}>
      <div className="home-highscore">
      <div className="score">
        <h5>
        Timo Leskinen
        </h5>
        </div>
          </div>    
      </Animated>
      <Animated animationIn="bounceInUp slower" animationOut="bounceOutRight faster" animationInDelay="4000"  animationOutDelay="250" isVisible={this.state.attractAnimation}>
      <div className="home-highscore">
      <div className="score">
        <h5>
        Tuomas Honkala
        </h5>
        </div>
          </div>    
      </Animated>
      <Animated animationIn="bounceInUp slower" animationOut="bounceOutLeft faster" animationInDelay="4500"  animationOutDelay="300" isVisible={this.state.attractAnimation}>
      <div className="home-highscore">
      <div className="score">
        <h5>
        Ville Hänninen
        </h5>
        </div>
          </div>    
      </Animated>
      <Animated animationIn="bounceInUp slower" animationOut="bounceOutRight faster" animationInDelay="5000"  animationOutDelay="350" isVisible={this.state.attractAnimation}>
      <div className="home-highscore">
      <div className="score">
        <h6>
        Toteutettu ohjelmistotuotantoprojektina
        </h6>
        </div>
          </div>    
      </Animated>
      <Animated animationIn="bounceInUp slower" animationOut="bounceOutLeft faster" animationInDelay="5500"  animationOutDelay="400" isVisible={this.state.attractAnimation}>
      <div className="home-highscore">
      <div className="score">
        <h6>
        Helsingin Yliopiston
        </h6>
        </div>
          </div>    
      </Animated>
      <Animated animationIn="bounceInUp slower" animationOut="bounceOutRight faster" animationInDelay="6000"  animationOutDelay="450" isVisible={this.state.attractAnimation}>
      <div className="home-highscore">
      <div className="score">
        <h6>
        {heartEmoji}Tietojenkäsittelytieteen laitokselle {heartEmoji}
        </h6>
        </div>
          </div>    
      </Animated>

</div>
      )

    } 
    
      return (
        <div>
        <div className="home-highscore-top">
                
        <Animated animationIn="bounceInUp slower" animationOut="bounceOutLeft faster" animationInDelay="1500" animationOutDelay="0" isVisible={this.state.attractAnimation}>
        <h4>
        Luupeli features music and sfx from Freesound.org
        </h4>
      </Animated>
      </div>
      <Animated animationIn="bounceInUp slower" animationOut="bounceOutRight faster" animationInDelay="2000"  animationOutDelay="50" isVisible={this.state.attractAnimation}>
      <div className="home-highscore">
      <div className="score">
        <h5>
        Chiptune Intro #1 by Fred1712
        </h5>
        </div>
          </div>    
      </Animated>
      <Animated animationIn="bounceInUp slower" animationOut="bounceOutLeft faster" animationInDelay="2500"  animationOutDelay="100" isVisible={this.state.attractAnimation}>
      <div className="home-highscore">
      <div className="score">
        <h5>
        Electro success sound by Mativve
        </h5>
        </div>
          </div>    
      </Animated>
      <Animated animationIn="bounceInUp slower" animationOut="bounceOutRight faster" animationInDelay="3000"  animationOutDelay="150" isVisible={this.state.attractAnimation}>
      <div className="home-highscore">
      <div className="score">
        <h5>
        Error.wav by Autistic Lucario
        </h5>
        </div>
          </div>    
      </Animated>
      <Animated animationIn="bounceInUp slower" animationOut="bounceOutLeft faster" animationInDelay="3500"  animationOutDelay="200" isVisible={this.state.attractAnimation}>
      <div className="home-highscore">
      <div className="score">
        <h5>
        Retro Bonus Pickup SFX by suntemple
        </h5>
        </div>
          </div>    
      </Animated>
      <Animated animationIn="bounceInUp slower" animationOut="bounceOutRight faster" animationInDelay="4000"  animationOutDelay="250" isVisible={this.state.attractAnimation}>
      <div className="home-highscore">
      <div className="score">
        <h5>
        Cool Chill Beat Loop by monkeyman535
        </h5>
        </div>
          </div>    
      </Animated>
      <Animated animationIn="bounceInUp slower" animationOut="bounceOutLeft faster" animationInDelay="5000"  animationOutDelay="300" isVisible={this.state.attractAnimation}>
      <div className="home-highscore">
      <div className="score">
        <h5>
        Used under Creative Commons (CC) license
        </h5>
        </div>
          </div>    
      </Animated>
      <Animated animationIn="bounceInUp slower" animationOut="bounceOutRight faster" animationInDelay="6000"  animationOutDelay="350" isVisible={this.state.attractAnimation}>
      <div className="home-highscore">
      <div className="score">
        <h5>
        The Luupeli devs kindly thank these content creators!
        </h5>
        </div>
          </div>    
      </Animated>
      </div>
      )
    

  }

  render() {
    if (process.env.NODE_ENV !== 'test') {
      skelly()
    }
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

    // This index will pick the proper style from style list
    let i = parseInt(localStorage.getItem('styleIndex'), 10)
    this.setThemeColors(i)

    return (
      <div id="homeMenu" className="App">
      <Sound
			  url="/sounds/351717__monkeyman535__cool-chill-beat-loop.mp3"
				playStatus={Sound.status.PLAYING}
				// playFromPosition={0 /* in milliseconds */}
				onLoading={this.handleSongLoading}
				onPlaying={this.handleSongPlaying}
        onFinishedPlaying={this.handleSongFinishedPlaying}
        loop="true"
			  />

        <div className="menu">
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
                
                {this.gameTitle()}
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
                    {this.adminButtons()}
                    {this.loggedInButtons()}
                    <Row className="show-grid">
                      <Col>
                        <button
                          className="menu-button"
                          id="bestPlayers"
                          onClick={this.proceedToSelect}>
                          &#9733; Pistetaulukko &#9733;
                       </button>
                      </Col>
                    </Row>
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
            {this.attractMode()}
            
          
              </div>
              </div>
              </div>
              </div>
              </div>
    )
  }
}
export default Home
