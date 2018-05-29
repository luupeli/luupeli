import React from 'react'
import { Link } from 'react-router-dom'

const SelectGameMode = () => (
	<div>
		<div className="App">
		<h1 className="h1">Valitse peli:</h1>
		<div className="btn-group">
			<Link to='/settings'><button>Kirjoituspeli</button></Link>
			<button>...</button>
			<button>...</button>
		</div>
		</div>
		<div className="App">
		<Link to='/'><button className="gobackbutton">Takaisin</button></Link>
		</div>
	</div>
)

export default SelectGameMode