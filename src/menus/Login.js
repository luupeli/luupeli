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
    const loggedUserJSON = localStorage.getItem('loggedLohjanLuunkeraajaUser')
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

  handleLoginFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    return (
      <div className="App">
        <div className="login-clean">
          <form onSubmit={this.login}>
            <h2 className="sr-only">Kirjaudu sisään</h2>
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
  }
}
export default Login