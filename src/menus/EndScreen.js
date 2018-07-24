import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

/**
 * EndScreen is the game over/results screen of Luupeli.
 * Besides the actual score, the player should also receive some feedback on what has been learned.
 * The answers are classified as being either correct, almost correct (bad syntax, but close enough) or incorrect. 
 * 
 * This class is still very much work-in-progress, as the results are not yet integrated into the database (persistent player-based stats)
 */
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
    
    let total = 0
    let time = 0;
    for (var i=0; i< this.props.game.stats.length; i++) {
      total +=  this.props.game.stats[i].score
      time+= Math.round(this.props.game.stats[i].seconds/10,2)
  }
  

    return (
      <div className='Appbd'>
<div><h1>Pelin kulku:</h1> 
<ul>
  {this.props.game.stats.map((stat) =>
    <li key={ stat.nameLatin }>Kysyttiin: {stat.nameLatin}, vastasit ajassa {Math.round(stat.seconds/10,2)} s: {stat.youAnswered} ... {stat.correctness}! {stat.score} pisteen arvoinen vastaus!</li>
  )
}
</ul>
<h2>Pisteet yhteensä: {total}</h2>
<h2>Pelin kesto: {time} s</h2>
</div>
<div>
<h1 className='h2' id="endScreenTitle">Lopputulos:</h1>
        <div id="resultsText">
          <p id="completelyCorrectAnswers">Täysin oikeita vastauksia: {correctAnswers.length}/{this.props.game.answers.length}</p><br />
          <p id="nearlyCorrectAnswers">Melkein oikeita vastauksia: {almostCorrectAnswers.length}/{this.props.game.answers.length}</p><br />
          <p id="wrongAnswers">Vääriä vastauksia: {wrongAnswers.length}/{this.props.game.answers.length}</p><br />
        </div>
        
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
