import React from 'react'
import { Redirect, Link } from 'react-router-dom'

class SelectGameMode extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      redirect: false,
      allStyles: JSON.parse(localStorage.getItem("allStyles")),
      styleIndex: localStorage.getItem('styleIndex')
    }

    this.proceedToSettings = this.proceedToSettings.bind(this)
    this.proceedToMain = this.proceedToMain.bind(this)
  }

  componentDidMount() {
    const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
    }
  }

  proceedToSettings(event) {
    this.setState({ redirect: true })
    this.setState({ redirectTo: '/settings' })
  }

  proceedToMain(event) {
    this.setState({ redirect: true })
    this.setState({ redirectTo: '/' })
  }

  render() {

    if (this.state.redirect) {
      return (
        <Redirect to={{
          pathname: this.state.redirectTo,
          state: {
            allStyles: this.state.allStyles,
            styleIndex: this.state.styleIndex
          }
        }} />
      )
    }

    let i = this.state.styleIndex

    return (
      <div className={this.state.allStyles[i].overlay}>
        <div className={this.state.allStyles[i].background}>
          <div className={this.state.allStyles[i].style}>
            <div id="gameBody" className="App">
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
              <h2 className="toprow">
                Valitse
              </h2>
              <h2 className="secondrow">
                Luupelimuoto:
              </h2>
              <div id="selectableGameModes" className="btn-group">
                <button
                  className="writinggame"
                  onClick={this.proceedToSettings}>
                  Kirjoituspeli
                </button>
                <button>:: Option #2 ::</button>
                <button>:: Option #3 ::</button>
              </div>
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