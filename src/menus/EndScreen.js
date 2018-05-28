import React from 'react'
import { Link } from 'react-router-dom'

const EndScreen = () => (
	<div className='App'>
		<h1 className='h2'>Lopputulos:</h1>
		<div>
			<p>Oikeita vastauksia: 3/3</p><br/>
		</div>
		<div>
			<Link to='/'><button className='gobackbutton'>Takaisin</button></Link>
		</div>
	</div>
)

export default EndScreen
