import React from 'react'
import loginService from '../../services/login'
import '../../styles/App.css'
import BackButton from '../BackButton'


class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allStyles: JSON.parse(localStorage.getItem("allStyles")),
      styleIndex: localStorage.getItem('styleIndex'),
      error: null,
      username: '',
      password: '',
      user: null
    }
    this.login = this.login.bind(this)
    this.handleLoginFieldChange = this.handleLoginFieldChange.bind(this)
  }

  // If loggedLohjanLuunkeraajaUser has a value, the user is logged in.
  // Put this info in the state.
  componentDidMount() {
    const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
    }
  }

  // Try to log in with the username and password given by the user using loginService.
  // If this is successful, set the user as the value of loggedLohjanLuunkeraajaUser
  // and get rid of state's username and password, which were the user's inputs.
  login = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })
     // console.log(user)
      window.sessionStorage.setItem('loggedLohjanLuunkeraajaUser', JSON.stringify(user))

      this.setState({
        username: '',
        password: '',
        user
      })
      this.props.history.push('/')
      // If we get here, the attempt to log in was unsuccessful.
    } catch (error) {
     // console.log(error)
      this.setState({ error: 'käyttäjätunnus tai salasana on virheellinen' })
      setTimeout(() => { this.setState({ error: null }) }, 5000)
    }
  }

  // Remove loggedLohjanLuunkeraajaUser so it no longer has a value, also
  // set user to null, and then they're officially logged out.
  logOut = async (event) => {
    event.preventDefault()
    try {
      window.sessionStorage.removeItem('loggedLohjanLuunkeraajaUser')
      this.setState({ user: null })
    } catch (error) {
  //    console.log(error)
    }
  }

  // Put the info given by the user in the state.
  handleLoginFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  // If user is null, they aren't logged in, so they can do that. Show fields for
  // username and password in this case.
  // If user is not null, they're logged in, so we tell them they're already logged in. Show
  // a button for logging out.
  ifLoggedInForms() {
    if (this.state.user === null) {
      return (
        <div className="login-clean">
          <span id="error-message">{this.state.error}</span>
          <form onSubmit={this.login}>
            <h2 className="sr-only">Placeholder #1</h2>
            <div className="form-group">
              <input
                id="username-form"
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
                id="password-form"
                className="form-control"
                type="password"
                name="password"
                placeholder="Salasana"
                value={this.state.password}
                onChange={this.handleLoginFieldChange}
              />
            </div>
            <div className="form-group btn-group">
              <button className="btn btn-block menu-button" type="submit" id="login-button">Kirjaudu</button>
            </div>
            {/* <a href="#" className="forgot">Unohditko sähköpostisi tai salasanasi?</a> */}
          </form>
        </div>
      )
    } else {
      return (
        <div className="login-clean">
          <form onSubmit={this.logOut}>
            <p>Olet kirjautunut sisään, {this.state.user.username}</p>
            <div className="form-group btn-group">
              <button className="btn btn-block" type="submit" id="logout-button">Kirjaudu ulos</button>
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
              <div className="transbox">
                {this.ifLoggedInForms()}
              </div>
              <BackButton action={() => this.props.history.push('/')} groupStyle="btn-group" buttonStyle="gobackbutton" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Login
