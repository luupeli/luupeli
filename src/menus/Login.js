import React from 'react'
import loginService from '../services/login'
import '../styles/App.css'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      style: localStorage.getItem('style'),
      error: null,
      username: '',
      password: '',
      user: null
    }

    this.login = this.login.bind(this)
    this.handleLoginFieldChange = this.handleLoginFieldChange.bind(this)
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

  render() {
    if (this.state.user === null) {
      return (
        <div className="App">
          <div className="login-clean">
            <form onSubmit={this.login}>
              <p>Kirjaudu sisään</p>
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
        </div>
      )
    } else {
      return (
        <div className="App">
          <div className="login-clean">
            <form onSubmit={this.logOut}>
              <p>Olet jo kirjautunut sisään, {this.state.user.username}</p>
              <div className="form-group btn-group">
                <button className="btn btn-block" type="submit">Kirjaudu ulos</button>
              </div>
            </form>
          </div>
        </div>
      )
    }
  }
}
export default Login