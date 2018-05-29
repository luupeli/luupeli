import React from 'react'
import { Link } from 'react-router-dom'

class GameSettings extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			bodyParts: [
				{
					checked: false
				},
				{
					checked: false
				},
				{
					checked: false
				},
				{
					checked: false
				}
			],
		};

		this.toggleCheck = this.toggleCheck.bind(this)
	}

	//if the id of the calling event is 1, change the boolean value
	//of index 1 of array bodyParts. The method creates a copy
	//of the existing array, modifies it, and replaces the old array
	//in this.state with it. Hopefully.
	toggleCheck(event) {

		const bodyParts = this.state.bodyParts

		if (bodyParts[event.target.id].checked)
			bodyParts[event.target.id].checked = false
		else {
			bodyParts[event.target.id].checked = true
		}
		this.setState({ bodyParts } )
	}

	render() {
		return (
			<div>
				<div className="App settingspage">
					<h1 className="h2">Valitse eläin:</h1>
					<form>
						<label className="radio-inline"><input type="radio" name="name" defaultChecked></input>Koira</label>
						<label className="radio-inline"><input type="radio" name="name"></input>Kissa</label>
						<label className="radio-inline"><input type="radio" name="name"></input>Hevonen</label>
						<label className="radio-inline"><input type="radio" name="name"></input>Gorilla</label>
					</form>
					<h1 className="h2">Valitse ruumiinosa:</h1>
					<form>
						<label className="checkbox-inline"><input type="checkbox" id="0" onClick={this.toggleCheck}></input>Pää</label>
						<label className="checkbox-inline"><input type="checkbox" id="1" onClick={this.toggleCheck}></input>Keho</label>
						<label className="checkbox-inline"><input type="checkbox" id="2" onClick={this.toggleCheck}></input>Eturaaja</label>
						<label className="checkbox-inline"><input type="checkbox" id="3" onClick={this.toggleCheck}></input>Takaraaja</label>
					</form>
					<h1 className="h2">Pelin pituus:</h1>
					<form>
						<label className="radio-inline"><input type="radio" name="1" defaultChecked></input>10</label>
						<label className="radio-inline"><input type="radio" name="1"></input>20</label>
						<label className="radio-inline"><input type="radio" name="1"></input>30</label>
					</form>
					<h1 className="h2">Vaikeusaste:</h1>
					<form>
						<label className="radio-inline"><input type="radio" name="1" defaultChecked></input>Helppo</label>
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