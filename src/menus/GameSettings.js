import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import WGMessage from '../games/writinggame/WGMessage'
import axios from 'axios'

/**
 * GameSettings is the menu directly prior to a WritingGame session.
 * A game session will be based on the selections made by user in the GameSettings menu.
 * Quite a lot of objects/arrays will be passed on using this.state.
 */
class GameSettings extends React.Component {

	constructor(props) {
		super(props);

		// The hardcoded database id's for bodyparts, animals etc. should
		// be considered as a temporary solution only. In the final product
		// bodyparts, animals etc. should be referenced by their actual
		// names, with the actual id's fetched as required using database
		// queries.

		this.state = {
			bodyParts: [
				{
					checked: false,
					id: "5b169f116dc0ce0014e657d3",
					name: "pää"
					
				},
				{
					checked: false,
					id: "5b169f166dc0ce0014e657d4",
					name: "keho"

				},
				{
					checked: false,
					id: "5b169f166dc0ce0014e657d5",
					name: "eturaaja"

				},
				{
					checked: false,
					id: "5b169f166dc0ce0014e657d",
					name: "takaraaja"
				}
			],
			animals: [
				{
					selected: true,
					id: "5b169ea96dc0ce0014e657cf",
					name: "koira"
				},
				{
					selected: false,
					id: "5b169eb66dc0ce0014e657d0",
					name: "kissa"
				},
				{
					selected: false,
					id: "5b169eba6dc0ce0014e657d1",
					name: "nauta"
				},
				{
					selected: false,
					id: "5b169ebe6dc0ce0014e657d2",
					name: "hevonen"
				}
			],
			redirect: false,
			testiviesti: 'Lällälläääääh',
			allImages: [],
			allAnimals: [],        // used to store an array of all known animals
			allBodyparts: [],      // used to store an array of all known bodyparts
			chosenBodypartIds: [], // used to store database id's for the user chosen bodyparts (for a game session)
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

		axios.get("http://luupeli-backend.herokuapp.com/api/animals")      // here we fill the allAnimals array with all the animals found in the database
		.then(response => {
			this.setState({ allAnimals: response.data })
			console.log(this.state.allAnimals)
			console.log(this.state.allAnimals[1]);
		
		})

		axios.get("http://luupeli-backend.herokuapp.com/api/bodyparts")    // here we fill the allBodyparts array with all the bodyparts found in the database
		.then(response => {
			this.setState({ allBodyparts: response.data })
			console.log(this.state.allBodyparts)
			console.log(this.state.allBodyparts[1]);
		
		})
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


		

	//	if (this.state.allBodyparts.length>0 && this.state.allAnimals.length>0) 
		axios.get("http://luupeli-backend.herokuapp.com/api/images")
			.then(response => {
				this.setState({ allImages: response.data })

				
				let chosenAnimalName = ''
				let animalIndex=0;

				let chosenBodypartIds = []
				let chosenBodypartNames = []
				//pics animal
				this.state.animals.map(function(animal, i) {
					if (animal.selected) {
						//chosenAnimalId = animal.id
					    // The above has been commented out in order to avoid reliance to the hardcoded database id's.
						// The actual id for the animal will be quaried in the for-loop below.
						chosenAnimalName = animal.name
					
				  }
				})

				console.log(this.state.allAnimals)
				

				// here we query the database id for the animal chosen by the user
				for (var key in this.state.allAnimals) { 
					if (this.state.allAnimals[key].name===chosenAnimalName) {
					  console.log("animal id löytyi!");
					  animalIndex=key;
					}
			   }

				// here we store the user chosen bodypart names as an array
				this.state.bodyParts.map(function(bodypart, i) {
					if (bodypart.checked) {
						chosenBodypartNames.push(bodypart.name)
   					 console.log('chosenBodypartNamesiin pushattiin '+bodypart.name)
					}
				})
				
				console.log(chosenBodypartNames)


		 // Here we convert the user chosen bodypart names into an array of bodypart database id's
		 //  Not pretty, but it does the job... :)
  		for (var key in chosenBodypartNames) {
            console.log('l-loop, key '+key )
				for(var subkey in this.state.allBodyparts){
					console.log('k-loop, subkey: '+subkey)
					if (chosenBodypartNames[key]===this.state.allBodyparts[subkey].name) {
					  console.log("bodypart matched!");
					  chosenBodypartIds.push(this.state.allBodyparts[subkey].id)
					  console.log('pushattiin chosenBodypart nimeltä '+chosenBodypartNames[key]+' id-array:hyn id:llä '+this.state.allBodyparts[subkey].id)
					}
			   }
			}
				console.log(chosenBodypartIds)
				console.log(this.state.chosenBodypartIds)
				console.log(chosenAnimalId)
				console.log(this.state.allImages)

				this.setState({ chosenBodypartIds })
				
				//filters the image array into containing only the images of the user chosen animal
				//NOTE: While the use of filter here is very clever, I think the number of images 
				//should be actually matched with the number of questions chosen by the user.
				//In a situation where there's not enough distinct bones to fill up a questionnaire,
				//then bones should be repeated (using alt images when possible).
				//
				//But for the time being, the implementation here is more than adequate.
				const apics = this.state.allImages.filter(image => image.bone.animal === this.state.allAnimals[animalIndex].id)
				
				//filters bodyparts, doesn't work properly currently
				//WILL BE FIXED SOON!
				const pics = apics.filter(apic => apic.bone.bodypart === this.state.bodyParts[1].id)
				
				
				//if criteria doesn't fulfill the game won't launch
				if (pics.length === 0) {
					this.wgmessage.mountTimer()
					this.wgmessage.setMessage('Peliä ei voitu luoda halutuilla asetuksilla')
				} else {
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
						images: this.state.images,
						allBodyparts: this.state.allBodyparts,   // Note here that the WritingGame will be provided with the full arrays of both all the bodyparts
						allAnimals: this.state.allAnimals        // ... and all the animals known in the database.
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
						<label className="radio-inline"><input type="radio" name="1"></input>Keskivaikea</label>
						<label className="radio-inline"><input type="radio" name="2"></input>Vaikea</label>
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