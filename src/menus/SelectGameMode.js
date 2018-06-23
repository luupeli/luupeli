import React from 'react'
import { Link } from 'react-router-dom'

const SelectGameMode = () => (
	<div>
		<div className="App">
		<div className="grid-sub-faster"
		></div>
		<div className="grid-faster">
		</div>
		<div className="grid-flair">
      </div>
  
  <div className="blinder">
  </div>
			<h2 className="h2 toprow">Valitse</h2>
			<h2 className="h2 secondrow">Luupelimuoto:</h2>
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