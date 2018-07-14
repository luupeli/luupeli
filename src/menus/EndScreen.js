import React from 'react'
import { Link, Redirect } from 'react-router-dom'
//import WGMessage from '../games/writinggame/WGMessage'

class EndScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      style: localStorage.getItem('style'),
      correct: props.location.state.correct,
      total: props.location.state.total,
      user: null,
      redirect: false
    }
    this.proceedToMain = this.proceedToMain.bind(this)
    window.onunload = function () { window.location.href = '/' }
  }

  componentDidMount() {
    const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
    }
  }

  proceedToMain(event) {
    this.setState({ redirect: true })
    this.setState({ redirectTo: '/' })
  }

  render() {
    if (this.state.redirect) {
			return (
				<Redirect to={{
					pathname: '/',
				}} />
			)
		}
    return (
      <div className='Appbd'>
        <h1 className='h2'>Lopputulos:</h1>
        <div>
          <p>Oikeita vastauksia: {this.state.correct}/{this.state.total}</p><br />
        </div>
        <div>
          <button className='gobackbutton' onClick={this.proceedToMain}>Etusivulle</button>
        </div>
      </div>
    )
  }
}

export default EndScreen
