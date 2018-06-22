import React from 'react'
import { Link } from 'react-router-dom'

const SelectGameMode = () => (
	<div>
		<div className="App">
		<div className="grid-faster">
  </div>

			<h2 className="h2">Valitse Luupelimuoto:</h2>
			<div className="btn-group">
				<Link to='/settings'><button className="writinggame">Kirjoituspeli</button></Link>
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