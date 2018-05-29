import React from 'react'
import { Link } from 'react-router-dom'

class GameSettings extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<div className="App settingspage">
					<h1 className="h2">Valitse eläin:</h1>
					<form>
						<label className="radio-inline"><input type="radio" name="name"></input>Koira</label>
						<label className="radio-inline"><input type="radio" name="name"></input>Kissa</label>
						<label className="radio-inline"><input type="radio" name="name"></input>Hevonen</label>
						<label className="radio-inline"><input type="radio" name="name"></input>Gorilla</label>
					</form>
					<h1 className="h2">Valitse ruumiinosa:</h1>
					<form>
						<label className="radio-inline"><input type="radio"></input>Pää</label>
						<label className="radio-inline"><input type="radio"></input>Keho</label>
						<label className="radio-inline"><input type="radio"></input>Eturaaja</label>
						<label className="radio-inline"><input type="radio"></input>Takaraaja</label>
					</form>
					<h1 className="h2">Pelin pituus:</h1>
					<form>
						<label className="radio-inline"><input type="radio" name="1"></input>10</label>
						<label className="radio-inline"><input type="radio" name="1"></input>20</label>
						<label className="radio-inline"><input type="radio" name="1"></input>30</label>
					</form>
					<h1 className="h2">Vaikeusaste:</h1>
					<form>
						<label className="radio-inline"><input type="radio" name="1"></input>Helppo</label>
						<label className="radio-inline"><input type="radio" name="1"></input>Keskivaikea</label>
						<label className="radio-inline"><input type="radio" name="1"></input>Vaikea</label>
					</form>
					<div className="btn-group settingspage">
						<Link to='/writinggame'><button>Peliin >></button></Link>
					</div>
				</div>
				<div className="App">
					<Link to='/game'><button className="gobackbutton">Takaisin</button></Link>
				</div>
			</div>
		);
	}
}

export default GameSettings