import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import WGMessage from '../games/writinggame/WGMessage'

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
			redirect: false
		};

		this.toggleCheck = this.toggleCheck.bind(this)
		this.atLeastOneBodyPartIsChecked = this.atLeastOneBodyPartIsChecked.bind(this)
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
		this.setState({ bodyParts })
	}

	//at least one body part needs to be selected, so here
	//we check if none is.
	atLeastOneBodyPartIsChecked() {

		if (!this.state.bodyParts[0].checked && !this.state.bodyParts[1].checked
			&& !this.state.bodyParts[2].checked && !this.state.bodyParts[3].checked) {
			this.wgmessage.mountTimer()
			this.wgmessage.setMessage('Valitse ainakin yksi ruumiinosa.')
		} else {
			this.setState({ redirect: true })
		}
	}

	render() {

		if (this.state.redirect) {
			return (
				<Redirect to='/writinggame' />
			)
		}
		return (
			<div>
				<div className="App settingspage">
					<div>
						<WGMessage ref={instance => this.wgmessage = instance} />
					</div>
					<h1 className="h2">Valitse eläin:</h1>
					<form>
						<label className="radio-inline"><input type="radio" name="name" defaultChecked></input>Koira</label>
						<label className="radio-inline"><input type="radio" name="name"></input>Kissa</label>
						<label className="radio-inline"><input type="radio" name="name"></input>Hevonen</label>
						<label className="radio-inline"><input type="radio" name="name"></input>Nauta</label>
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
						<button onClick={this.atLeastOneBodyPartIsChecked}>Peliin >></button>
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