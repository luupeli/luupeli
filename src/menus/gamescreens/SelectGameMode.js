import React from 'react'
import { Redirect } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import imageService from '../../services/images'
import { gameInitialization } from '../../reducers/gameReducer'
import { connect } from 'react-redux'
import { Animated } from "react-animated-css";
import emoji from 'node-emoji'
import Sound from 'react-sound'

class SelectGameMode extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      gamemode: '',
      allStyles: JSON.parse(localStorage.getItem("allStyles")),
      styleIndex: localStorage.getItem('styleIndex'),
      user: null,
      instructionMode: 0,
      instructionAnimation: true,
      loopTheMusicMore: false,
    }
    this.proceedToSettings = this.proceedToSettings.bind(this)
    this.proceedToMain = this.proceedToMain.bind(this)
    this.proceedToExam = this.proceedToExam.bind(this)
    window.onunload = function () { window.location.href = '/' };
  }

  componentDidMount() {
    const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
    }

    imageService.getAll()  // here we fill the image array
      .then(response => {
        const imagesWithBone = response.data.filter(image => image.bone !== undefined)
        this.setState({ images: imagesWithBone })
      })
  }

  /**
* With the component mounting, the game time measuring tick() is set at 1000 milliseconds.
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
    if (this.state.instructionMode % 20 > 16) {
      this.setState({ instructionMode: this.state.instructionMode + 1, instructionAnimation: false })
    } else {
      this.setState({ instructionMode: this.state.instructionMode + 1, instructionAnimation: true })

    }
  }


  instructionMode() {
    
    
    var effects= [];
    effects.push('bounceOutLeft faster')
    effects.push('bounceOutRight faster')
    let heartEmoji = emoji.get('yellow_heart')

    

  
   var lines = [];
   var heading = ''

   if (this.state.instructionMode%100<=20) {
    heading='KIRJOITUSPELI'
    lines.push('Ansaitse pisteitä kirjoittamalla latinankielinen nimi oikein')
    lines.push('Korota pistekerrointasi vastaamalla peräkkäin oikein')
    lines.push('Väärästä vastauksesta pistekerroin nollaantuu')
    lines.push('Vaikeusaste vaikuttaa pisteisiin')
    lines.push('Helpoimmalla vaikeusasteella saat vihjeitä vastauksesta')
    lines.push('Nopeus on valttia! '+heartEmoji)
   }
   else if (this.state.instructionMode%100<=40) {
    heading='MONIVALINTAPELI'
    lines.push('Valitse kuva joka esittää latinankielisesti nimettyä luuta')
    lines.push('Voit myös yrittää parasta arvaustasi...')
    lines.push('Korota pistekerrointasi vastaamalla peräkkäin oikein')
    lines.push('Nopeus on valttia! '+heartEmoji)
   }

   else if (this.state.instructionMode%100<=60) {
    heading='SEKAPELI'
    lines.push('Valitse kuva joka esittää latinankielisesti nimettyä luuta')
    lines.push('Sekapelissä osassa kysymyksistä kuvia on yksi, mutta nimivaihtoehtoja monta')
    lines.push('Korota pistekerrointasi vastaamalla peräkkäin oikein')
    lines.push('Nopeus on valttia! '+heartEmoji)
   } else if (this.state.instructionMode%100<=80) {
    heading='HARJOITUSTENTTI'
    lines.push('Kuin kirjoituspeli, mutta tenttipituisena')
    lines.push('Harjoitustentissä vaikeusaste on lukittu vaikeimpaan, et siis saa vihjeitä')
    lines.push('Pistekertoimet toimivat kuten tavallisessa kirjoituspelissä')
    lines.push('Nopeus on jälleen valttia! '+heartEmoji)
   } else if (this.state.instructionMode%100<=100) {
    heading='MUISTA SISÄÄNKIRJAUTUA'
    lines.push('Vain sisäänkirjautuneiden käyttäjien tulokset tallennetaan')
    lines.push('Jos sinulla ei ole käyttäjätunnusta, voit luoda sellaisen päävalikossa')
    lines.push('Parhaat luupelaajat niittävät mainetta pistetaulukoilla! '+heartEmoji)
   } 
   

   const rollingMessage = lines.map((line,i) =>
   <Animated animationIn="bounceInUp slower" animationOut={effects[i%2]} animationInDelay={1500+(i*500)}  animationOutDelay={i*50} isVisible={this.state.instructionAnimation}>
         <div className="home-highscore">
      {/* <div className="score"> */}
       <h5>
     {line.toUpperCase()}
     </h5>
     {/* </div> */}
     </div>
       
   </Animated>
  )

      return (

        <div>
        <div className="home-highscore-top">
                    
                    <Animated animationIn="bounceInUp slower" animationOut="bounceOutRight faster" animationInDelay={1000} animationOutDelay={0} isVisible={this.state.instructionAnimation}>
                    <h3>
                    {heading}
                    </h3>
                  </Animated>
                  </div>
              {rollingMessage}
                  </div>
      )
  
}

startTheMusic () {
   this.setState({loopTheMusicMore: true})
}

musicPlayer() {
  if (this.state.loopTheMusicMore) {
  return (
    <Sound
    url={"/sounds/"+this.state.allStyles[this.state.styleIndex].music}
      playStatus={Sound.status.PLAYING}
      //  playFromPosition={new Date().getTime()-this.state.musicStartTime}
      onLoading={this.handleSongLoading}
      onPlaying={this.handleSongPlaying}
      onFinishedPlaying={this.handleSongFinishedPlaying}
      loop={this.state.loopTheMusicMore}
      />

  )}
  else if (!this.state.loopTheMusicMore) {
    return (
      <Sound
      url={"/sounds/"+this.state.allStyles[this.state.styleIndex].music}
        playStatus={Sound.status.STOPPED}
        // playFromPosition={new Date().getTime()-this.state.musicStartTime}
        onLoading={this.handleSongLoading}
        onLoad={this.startTheMusic()}
        onPlaying={this.handleSongPlaying}
        onFinishedPlaying={this.handleSongFinishedPlaying}
        loop={this.state.loopTheMusicMore}
        />
  
    )
  } else {return null}
}
  proceedToExam(event) {
    this.props.gameInitialization(15, this.state.images, this.state.user,
      event.target.value, this.props.init.animals, this.props.init.bodyParts, false, 'hard')
    this.setState({ redirect: true })
    this.setState({ redirectTo: '/game' })
  }

  proceedToSettings(event) {
    this.setState({ gamemode: event.target.value })
    this.setState({ redirect: true })
    this.setState({ redirectTo: '/settings' })
  }

  proceedToMain(event) {
    this.setState({ redirect: true })
    this.setState({ redirectTo: '/' })
  }

  render() {
    if (this.state.redirect) {
      console.log(this.state.gamemode)
      return (
        <Redirect to=
          {{
            pathname: this.state.redirectTo,
            state: {
              allStyles: this.state.allStyles,
              styleIndex: this.state.styleIndex,
              gamemode: this.state.gamemode
            }
          }}
        />
      )
    }
    let i = this.state.styleIndex
    return (
      <div id="gameBody" className="App menu">
       {this.musicPlayer()}
        <div className={this.state.allStyles[i].overlay}>
          <div className={this.state.allStyles[i].background}>
            <div className={this.state.allStyles[i].style}>
              <div
                className={this.state.allStyles[i].flairLayerA}>
              </div>
              <div
                className={this.state.allStyles[i].flairLayerB}>
              </div>
              <div
                className={this.state.allStyles[i].flairLayerC}>
              </div>
              <div
                className={this.state.allStyles[i].flairLayerD}>
              </div>
              <Animated animationIn="bounceInLeft" animationInDelay={0} isVisible={true}>
              <h2 className="game-title">Valitse</h2>
              </Animated>
              <Animated animationIn="bounceInRight" animationInDelay={100} isVisible={true}>
              <h2 className="game-title">luupelimuoto</h2>
              </Animated>
              <Row className="show-grid">
                <Col xs={10} xsOffset={1} md={4} sm={4} mdOffset={4} smOffset={4}>
                  <Row className="show-grid">
                    <Col>
                    <Animated animationIn="bounceInLeft" animationInDelay={200} isVisible={true}>
                      <button
                        className="menu-button"
                        id="writingGameButton"
                        value="kirjoituspeli"
                        onClick={this.proceedToSettings}>
                        Kirjoituspeli
                      </button>
                      </Animated>
                    </Col>
                  </Row>
                  <Row className="show-grid">
                    <Col>
                    <Animated animationIn="bounceInRight" animationInDelay={300} isVisible={true}>
                      <button
                        className="menu-button"
                        id="multipleChoiceButton"
                        value="monivalintapeli"
                        onClick={this.proceedToSettings}>
                        Monivalintapeli
                      </button>
                      </Animated>
                    </Col>
                  </Row>
                  <Row className="show-grid">
                    <Col>
                    <Animated animationIn="bounceInLeft" animationInDelay={400} isVisible={true}>
                      <button
                        className="menu-button"
                        id="mixedGameButton"
                        value="sekapeli"
                        onClick={this.proceedToSettings}>
                        Sekapeli
                      </button>
                      </Animated>
                    </Col>
                  </Row>
                  <Row className="show-grid">
                    <Col>
                    <Animated animationIn="bounceInRight" animationInDelay={500} isVisible={true}>
                      <button
                        className="menu-button"
                        id="examButton"
                        value="harjoitustentti"
                        onClick={this.proceedToExam}>
                        Harjoitustentti
                      </button>
                      </Animated>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {this.instructionMode()}
              <div className="btn-group">
                <button
                  id="goBackButton"
                  className="gobackbutton"
                  onClick={this.proceedToMain}>
                  Takaisin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    game: state.game,
    init: state.init
  }
}

const mapDispatchToProps = {
  gameInitialization
}

const ConnectedSelectGameMode = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectGameMode)
export default ConnectedSelectGameMode