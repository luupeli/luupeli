import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

class EndScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      style: localStorage.getItem('style'),
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
    
    const correctAnswers = this.props.game.answers.filter(ans => ans.correctness === 100)
    const almostCorrectAnswers = this.props.game.answers.filter(ans => ans.correctness > 70 && ans.correctness < 100)
    const wrongAnswers = this.props.game.answers.filter(ans => ans.correctness <= 70)

    return (
      <div className='Appbd'>
        <h1 className='h2' id="endScreenTitle">Lopputulos:</h1>
        <div id="resultsText">
          <p id="completelyCorrectAnswers">Täysin oikeita vastauksia: {correctAnswers.length}/{this.props.game.answers.length}</p><br />
          <p id="nearlyCorrectAnswers">Melkein oikeita vastauksia: {almostCorrectAnswers.length}/{this.props.game.answers.length}</p><br />
          <p id="wrongAnswers">Vääriä vastauksia: {wrongAnswers.length}/{this.props.game.answers.length}</p><br />
        </div>
        <div>
          <button className='gobackbutton' onClick={this.proceedToMain}>Etusivulle</button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    game: state.game
  }
}

const ConnectedEndScreen = connect(
  mapStateToProps,
  null
)(EndScreen)
export default ConnectedEndScreen
