import React from 'react'
import loginService from '../services/login'
import '../styles/App.css'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      //style: localStorage.getItem('style'),
      allStyles: JSON.parse(localStorage.getItem("allStyles")),
      styleIndex: localStorage.getItem('styleIndex'),
      error: null,
      username: '',
      password: '',
      user: null
    }

    this.login = this.login.bind(this)
    this.handleLoginFieldChange = this.handleLoginFieldChange.bind(this)
    window.onunload = function () { window.location.href = '/' };
  }

  componentDidMount() {
    const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
    }
  }

  login = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })
      console.log(user)
      window.sessionStorage.setItem('loggedLohjanLuunkeraajaUser', JSON.stringify(user))
      this.setState({
        username: '',
        password: '',
        user
      })
    } catch (error) {
      console.log(error)
      this.setState({ error: 'käyttäjätunnus tai salasana on virheellinen' })
      setTimeout(() => { this.setState({ error: null }) }, 5000)
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

  handleLoginFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  ifLoggedInForms() {
    if (this.state.user === null) {
      return (
        <div className="login-clean">
          <form onSubmit={this.login}>
            <h2 className="sr-only">Placeholder #1</h2>
            <div className="form-group">
              <input
                className="form-control"
                type="username"
                name="username"
                placeholder="Käyttäjätunnus"
                value={this.state.username}
                onChange={this.handleLoginFieldChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="password"
                name="password"
                placeholder="Salasana"
                value={this.state.password}
                onChange={this.handleLoginFieldChange}
              />
            </div>
            <div className="form-group btn-group">
              <button className="btn btn-block" type="submit">Kirjaudu</button>
            </div>
            {/* <a href="#" className="forgot">Unohditko sähköpostisi tai salasanasi?</a> */}
          </form>
        </div>
      )
    } else {
      return (
        <div className="login-clean">
          <form onSubmit={this.logOut}>
            <p>Olet jo kirjautunut sisään, {this.state.user.username}</p>
            <div className="form-group btn-group">
              <button className="btn btn-block" type="submit">Kirjaudu ulos</button>
            </div>
          </form>
        </div>
      )
    }
  }

  render() {

    let i = this.state.styleIndex
    return (
      <div className={this.state.allStyles[i].overlay}>
        <div className={this.state.allStyles[i].background}>
          <div className={this.state.allStyles[i].style}>
            <div id="loginPromptMenu" className="App">
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
              <h2 className="toprow">Luukirjaudu sisään</h2>
              <div class="transbox">
                {this.ifLoggedInForms()}
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
export default Login
