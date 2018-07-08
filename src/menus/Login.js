import React from 'react'
import '../styles/App.css'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      style: localStorage.getItem('style')
    }
  }

  render() {
    return (
      <div class="App">
        <div class="login-clean">
          <form method="post">
            <h2 class="sr-only">Login Form</h2>
            <div class="form-group"><input class="form-control" type="username" name="username" placeholder="Käyttäjätunnus" /></div>
            <div class="form-group"><input class="form-control" type="password" name="password" placeholder="Salasana" /></div>
            <div class="form-group btn-group"><button class="btn btn-block" type="submit">Kirjaudu sisään</button></div>
            {/* <a href="#" class="forgot">Unohditko sähköpostisi tai salasanasi?</a> */}
          </form>
        </div>
      </div>
    )
  }
}
export default Login