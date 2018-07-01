import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import WGMessage from '../games/writinggame/WGMessage'
import axios from 'axios'

/**
 * GameSettings is the menu directly prior to a WritingGame session.
 * A game session will be based on the selections made by user in the GameSettings menu.
 * Quite a lot of objects/arrays will be passed on using this.state.
 * 
 * To install mode-emoji-support for NodeJS
 * npm install --save node-emoji
 * 
 */
class GameSettings extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			gameLength: 3,
			redirect: false,
			testiviesti: 'Ladataan...',
			allImages: [],		   // used to store an array of alla known images
			allAnimals: [],        // used to store an array of all known animals
			allBodyParts: [],      // used to store an array of all known bodyparts
      images: [],			   // used to store an array of images which meet the selection criteria
      style: localStorage.getItem('style')
		};

		this.changeAnimal = this.changeAnimal.bind(this)
		this.toggleCheck = this.toggleCheck.bind(this)
		this.atLeastOneBodyPartIsSelected = this.atLeastOneBodyPartIsSelected.bind(this)
		this.initializeGame = this.initializeGame.bind(this)

		axios.get("http://luupeli-backend.herokuapp.com/api/animals")  // here we fill the allAnimals array and connect selected-attribute for each row 
			.then(response => {
				const animals = response.data.map(animal => {
					return { ...animal, selected: false }
				})
				

				/*
				Here we try to fetch emojis for the animals.
				*/
				for (var key in animals) {
					
					if (animals[key].name.toLowerCase()==='kissa') {
						var emo = require('node-emoji')
						emo=emo.get('cat') 
						console.log(emo)
						animals[key].emoji= emo;
					}
					if (animals[key].name.toLowerCase()==='koira') {
						var emo = require('node-emoji')
						emo=emo.get('dog') 
						console.log(emo)
						animals[key].emoji= emo;
					}
					if (animals[key].name.toLowerCase()==='hevonen') {
						var emo = require('node-emoji')
						emo=emo.get('horse') 
						console.log(emo)
						animals[key].emoji= emo;
					}

					if (animals[key].name.toLowerCase()==='nauta') {
						var emo = require('node-emoji')
						emo=emo.get('cow') 
						console.log(emo)
						animals[key].emoji= emo;
					}

				}
				this.setState({ allAnimals: animals })
			})

		axios.get("http://luupeli-backend.herokuapp.com/api/bodyparts")    // here we fill the allBodyParts array and connect selected-attribute for each row 
			.then(response => {
				const bodyParts = response.data.map(bodyPart => {
					return { ...bodyPart, selected: false }
				})
				this.setState({ allBodyParts: bodyParts })
			})

		axios.get("http://luupeli-backend.herokuapp.com/api/images")  // here we fill the image array
			.then(response => {
				const imagesWithBone = response.data.filter(image => image.bone !== undefined)
				console.log(imagesWithBone)
				this.setState({ allImages: imagesWithBone })
			})
		console.log(this.state.allImages)
	}

	changeGameLength(event) {
		this.state.gameLength = event.target.value

		console.log('Pelin pituus on nyt ... ' + this.state.gameLength)
	}

	changeAnimal(event) {
		const animals = this.state.allAnimals
		animals.forEach((animal) => {
			animal.selected = false
		})
		animals[event.target.id].selected = true;
		console.log(this.state.allAnimals)
	}

	//if the id of the calling event is 1, change the boolean value
	//of index 1 of array bodyParts. The method creates a copy
	//of the existing array, modifies it, and replaces the old array
	//in this.state with it. Hopefully.
	toggleCheck(event) {
		const bodyParts = this.state.allBodyParts
		console.log(event.target)
		if (bodyParts[event.target.id].selected)
			bodyParts[event.target.id].selected = false
		else {
			bodyParts[event.target.id].selected = true
		}
		this.setState({ allbodyParts: bodyParts })
		console.log(this.state.allBodyParts)
	}

	//at least one body part needs to be selected, so here
	//we check if none is.
	atLeastOneBodyPartIsSelected() {
		if (!this.state.allBodyParts[0].selected && !this.state.allBodyParts[1].selected
			&& !this.state.allBodyParts[2].selected && !this.state.allBodyParts[3].selected) {
			this.wgmessage.mountTimer()
			this.wgmessage.setMessage('Valitse ainakin yksi ruumiinosa.')
		} else {
			this.initializeGame()
		}
	}

	//returns the state
	state() {
		return this.state
	}


	initializeGame() {
		// Filtering selected animals and body parts
		let chosenAnimals = this.state.allAnimals.filter(animal => animal.selected === true)
		let chosenBodyParts = this.state.allBodyParts.filter(bodyPart => bodyPart.selected === true)

		console.log(this.state.allAnimals)
		console.log(chosenAnimals)
		console.log(chosenBodyParts)

		//filters the image array into containing only the images of the user chosen animal
		//NOTE: While the use of filter here is very clever, I think the number of images 
		//should be actually matched with the number of questions chosen by the user.
		//In a situation where there's not enough distinct bones to fill up a questionnaire,
		//then bones should be repeated (using alt images when possible).

		// Filtering the approved images on animals
		let apics = this.state.allImages.filter(image => {
			const animalIds = chosenAnimals.map(chosenAnimal => chosenAnimal.id)
			if(image.animal !== undefined) {
			return animalIds.includes(image.animal._id)
			}
		})
		console.log(apics)

		// Filtering the approved images on body parts
		apics = apics.filter(image => {
			const bodyPartIds = chosenBodyParts.map(chosenBodyPart => chosenBodyPart.id)
			return bodyPartIds.includes(image.bone.bodyPart)
		})
		console.log(apics)

		const pics = [];
		if (apics.length !== 0) {
			// Here we add as many images into the quiz as dictated by the gameLength option, but less if we don't
			// have enough images.

			// Maybe it would be a better option to send all valid photos to WritingGame and choose 
			// the images first at random and then according to the user's knowledge. If the user did 
			// not respond correctly, it may be asked later.

			for (let index = 0; index < this.state.gameLength; index++) {
				if (index < apics.length) {
					pics.push(apics[index])
				}
			}
		}

		//if criteria doesn't fulfill the game won't launch
		if (pics.length === 0) {
			this.wgmessage.mountTimer()
			this.wgmessage.setMessage('Peliä ei voitu luoda halutuilla asetuksilla')
		} else {
			this.setState({ images: pics })
			this.setState({ redirect: true })
		}
		console.log(pics)

	}


	//this starts the game
	render() {
		if (this.state.redirect) {
			return (
				<Redirect to={{
					pathname: '/writinggame',
					state: {
						images: this.state.images,
						allBodyParts: this.state.allBodyParts,   // Note here that the WritingGame will be provided with the full arrays of both all the bodyparts
						allAnimals: this.state.allAnimals        // ... and all the animals known in the database.
					}
				}} />
			)
		}

		// Creating an animal menu
		let id = -1
		const selectAnimal = this.state.allAnimals.map(animal => {
			id++
			return <label className="radio-inline"><input type="radio" id={id} name="animal" onClick={this.changeAnimal}></input>{animal.emoji}{animal.name}</label>
		})

		// Creating a body part menu
		id = -1
		const selectBodyPart = this.state.allBodyParts.map(bodyPart => {
			id++
			return <label className="checkbox-inline"><input type="checkbox" id={id} onClick={this.toggleCheck}></input>{bodyPart.name}</label>
		})

		// As a general note about using forms w/ NodeJS... A single grouping of radio buttons (single choice) is identified by identical "name" parameter. Separate values within such a grouping are marked with distinct "value" parameters.
		return (
			<div>
				<div className={"App" + this.state.style + " settingspage"}>
				<div className={"grid-sub-fastest" + this.state.style}>
				  </div>
				<div className={"grid-fastest" + this.state.style}>
				  </div>
				  <div className={"grid-flair" + this.state.style}>
  				</div>
			  <div className={"blinder" + this.state.style}>
  				</div>
				    <h2 className={"h2" + this.state.style}>Luupelivalinnat:</h2>
					<div>
						<WGMessage ref={instance => this.wgmessage = instance} />
					</div>
					<div class={"transbox" + this.state.style}>
					<div class="container">	
						<div class="col-md-12">
							<h1 className={"form-header" + this.state.style}>Valitse eläin:</h1>
							<form>
								{selectAnimal}
							</form>
						</div>
					</div>
					<div class="container">
						<div class="col-md-12">
							<h1 className={"form-header" + this.state.style}>Valitse ruumiinosa:</h1>
							<form>
								{selectBodyPart}
							</form>
						</div>
					</div>
					<div class="container">
						<div class="col-md-12">	
							<h1 className={"form-header" + this.state.style}>Luupelin pituus:</h1>
							<form>
								<label className="radio-inline"><input type="radio" value="3" onClick={this.changeGameLength.bind(this)} name="length" defaultChecked></input>3</label>
								<label className="radio-inline"><input type="radio" value="5" onClick={this.changeGameLength.bind(this)} name="length"></input>5</label>
								<label className="radio-inline"><input type="radio" value="7" onClick={this.changeGameLength.bind(this)} name="length"></input>7</label>
							</form>
						</div>
					</div>
					<div class="container">
						<div class="col-md-12">
							<h1 className={"form-header" + this.state.style}>Vaikeusaste:</h1>
							<form>
								<label className="radio-inline"><input type="radio" value="easy" name="difficultylevel" defaultChecked></input>Helppo</label>
								<label className="radio-inline"><input type="radio" value="medium" name="difficultylevel"></input>Keskivaikea</label>
								<label className="radio-inline"><input type="radio" value="hard" name="difficultylevel"></input>Vaikea</label>
							</form>
							<div className="btn-group wide settingspage GameButton">
								<button onClick={this.atLeastOneBodyPartIsSelected}>Luupeliin >>
								</button>
							</div>
						</div>
					</div>
				</div>
				</div>
				
				<div className={"App" + this.state.style}>
					<Link to='/game'><button className="gobackbutton">Takaisin</button></Link>
				</div>
			</div>
		);
	}
}

export default GameSettings