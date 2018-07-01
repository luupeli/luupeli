import React from 'react'
import { Link } from 'react-router-dom'
//import WGMessage from '../games/writinggame/WGMessage'

class EndScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      style: localStorage.getItem('style'),
      correct: props.location.state.correct,
      total: props.location.state.total
    }
  }


  render() {
    return (
      <div className='Appbd'>
        <h1 className='h2'>Lopputulos:</h1>
        <div>
          <p>Oikeita vastauksia: {this.state.correct}/{this.state.total}</p><br />
        </div>
        <div>
          <Link to='/'><button className='gobackbutton'>Etusivulle</button></Link>
        </div>
      </div>
    )
  }

}

export default EndScreen
