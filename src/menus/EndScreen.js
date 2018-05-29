import React from 'react'
import { Link } from 'react-router-dom'
//import WGMessage from '../games/writinggame/WGMessage'

const EndScreen = (props) => {
	return (
		<div className='App'>
			<h1 className='h2'>Lopputulos:</h1>
			<div>
				<p>Oikeita vastauksia: {props.location.state.correct}/{props.location.state.total}</p><br />
			</div>
			<div>
				<Link to='/'><button className='gobackbutton'>Etusivulle</button></Link>
			</div>
		</div>
	)
}

export default EndScreen
