import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import WGMessage from '../games/writinggame/WGMessage'
import axios from 'axios'

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
			animals: [
				{
					selected: true,
					id: "5b169ea96dc0ce0014e657cf"
				},
				{
					selected: false,
					id: "5b169eb66dc0ce0014e657d0"
				},
				{
					selected: false,
					id: "5b169eba6dc0ce0014e657d1"
				},
				{
					selected: false,
					id: "5b169ebe6dc0ce0014e657d2"
				}
			],
			redirect: false,
			testiviesti: 'Lällälläääääh',
			allImages: [],
			images:  [
				{
				  id: 1,
				  name: "Mansikka", 
				  src: "mansikka.jpg"
				},
				{
				  id: 2,
				  name: "Mustikka", 
				  src: "mustikka.jpg"
				},
				{
				  id: 3,
				  name: "Kirsikka", 
				  src: "kirsikka.jpg"
				},
				{
				  id: 4,
				  name: "Persikka", 
				  src: "persikka.jpg"
				},
				{
				  id: 5,
				  name: "Omena", 
				  src: "omena.jpg"
				}
			  ]
		};

		this.changeAnimal = this.changeAnimal.bind(this)
		this.toggleCheck = this.toggleCheck.bind(this)
		this.atLeastOneBodyPartIsChecked = this.atLeastOneBodyPartIsChecked.bind(this)
		this.initializeGame = this.initializeGame.bind(this)
	}

	changeAnimal(event) {
		const animals = this.state.animals
		animals.forEach((animal) => {
			animal.selected = false
		})
		animals[event.target.id].selected = true;
	}

	//if the id of the calling event is 1, change the boolean value
	//of index 1 of array bodyParts. The method creates a copy
	//of the existing array, modifies it, and replaces the old array
	//in this.state with it. Hopefully.
	toggleCheck(event) {
		const bodyParts = this.state.bodyParts
		console.log(event.target.id)
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
			this.initializeGame()
		}
	}

	//this starts the game
	initializeGame() {
		axios.get("http://luupeli-backend.herokuapp.com/api/images")
			.then(response => {
				this.setState({ allImages: response.data })

				//const pics = this.state.allImages.filter(image => image.bone.name === "lantioluu")
				var chosenAnimalId = 0
				this.state.animals.map(function(animal, i) {
					if (animal.selected) {
						chosenAnimalId = animal.id
					}
				})
				console.log(chosenAnimalId)
				console.log(this.state.allImages)
				const pics = this.state.allImages.filter(image => image.bone.animal === chosenAnimalId)

				if (pics.length === 0) {
					this.wgmessage.mountTimer()
					this.wgmessage.setMessage('Peliä ei voitu luoda halutuilla asetuksilla')
				} else {
					console.log(pics)
					this.setState({ images: pics })
	
					this.setState({ redirect: true })
				}
			})
	}

	render() {
		if (this.state.redirect) {
			return (
				<Redirect to={{
					pathname: '/writinggame',
					state: {
						testiviesti: this.state.testiviesti,
						images: this.state.images
					}
				 }} />
			)
		}
		return (
			<div>
				<div className="App settingspage">
					<div>
						<WGMessage ref={instance => this.wgmessage = instance} />
					</div>
					{/*Maybe fix h1 and its classname "H2"?*/}
					<h1 className="h2">Valitse eläin:</h1>
					<form>
						<label className="radio-inline"><input type="radio" id="0" name="name" onClick={this.changeAnimal} defaultChecked></input>Koira</label>
						<label className="radio-inline"><input type="radio" id="1" name="name" onClick={this.changeAnimal}></input>Kissa</label>
						<label className="radio-inline"><input type="radio" id="2" name="name" onClick={this.changeAnimal}></input>Hevonen</label>
						<label className="radio-inline"><input type="radio" id="3" name="name" onClick={this.changeAnimal}></input>Nauta</label>
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
						<label className="radio-inline"><input type="radio" name="0" defaultChecked></input>10</label>
						<label className="radio-inline"><input type="radio" name="1"></input>20</label>
						<label className="radio-inline"><input type="radio" name="2"></input>30</label>
					</form>
					<h1 className="h2">Vaikeusaste:</h1>
					<form>
						<label className="radio-inline"><input type="radio" name="0" defaultChecked></input>Helppo</label>
						<label className="radio-inline"><input type="radio" name="2"></input>Keskivaikea</label>
						<label className="radio-inline"><input type="radio" name="3"></input>Vaikea</label>
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