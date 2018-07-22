import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'

class SelectGameMode extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      redirect: false,
      gamemode: '',
      allStyles: JSON.parse(localStorage.getItem("allStyles")),
      styleIndex: localStorage.getItem('styleIndex')
    }

    this.proceedToSettings = this.proceedToSettings.bind(this)
    this.proceedToMain = this.proceedToMain.bind(this)

    window.onunload = function () { window.location.href = '/' };
  }

  componentDidMount() {
    const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
    }
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
        <Redirect to={{
          pathname: this.state.redirectTo,
          state: {
            allStyles: this.state.allStyles,
            styleIndex: this.state.styleIndex,
            gamemode: this.state.gamemode
          }
        }} />
      )
    }

    let i = this.state.styleIndex

    return (
      <div id="gameBody" className="App">
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
              <h2 className="game-title">Valitse</h2>
              <h2 className="game-title">luupelimuoto</h2>
              <Row className="show-grid">
                <Col xs={10} xsOffset={1} md={4} sm={4} mdOffset={4} smOffset={4}>
                  <Row className="show-grid">
                    <Col>
                      <button
                        className="menu-button"
                        id="writingGameButton"
                        value="kirjoituspeli"
                        onClick={this.proceedToSettings}>
                        Kirjoituspeli
                      </button>
                    </Col>
                  </Row>
                  <Row className="show-grid">
                    <Col>
                    <button
                        className="menu-button"
                        id="multipleChoiceButton"
                        value="monivalintapeli"
                        onClick={this.proceedToSettings}>
                        Monivalintapeli
                      </button>
                    </Col>
                  </Row>
                  <Row className="show-grid">
                    <Col>
                      <button
                        className="menu-button">
                        :: valinta 3 ::
                      </button>
                    </Col>
                  </Row>
                </Col>
              </Row>
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

export default SelectGameMode
