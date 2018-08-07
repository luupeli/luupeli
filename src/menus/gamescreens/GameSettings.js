import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import Message from '../../games/Message'
import imageService from '../../services/images'
import bodyPartService from '../../services/bodyParts'
import animalService from '../../services/animals'
import { injectGlobal } from 'styled-components'
import { gameInitialization } from '../../reducers/gameReducer'
import { connect } from 'react-redux'
import { setMessage } from '../../reducers/messageReducer'
import emoji from 'node-emoji'

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
		super(props)
		this.state = {
			gameLength: 5,
			gamemode: '',
			redirect: false,
			allImages: [],		   // used to store an array of alla known images
			allAnimals: [],        // used to store an array of all known animals
			allBodyParts: [],      // used to store an array of all known bodyparts
			images: [],			   // used to store an array of images which meet the selection criteria
			allStyles: JSON.parse(localStorage.getItem("allStyles")),
			styleIndex: localStorage.getItem('styleIndex'),
      user: null,
      animals: [],
      bodyParts: []
		}

		this.changeAnimal = this.changeAnimal.bind(this)
		this.toggleCheck = this.toggleCheck.bind(this)
		this.atLeastOneBodyPartIsSelected = this.atLeastOneBodyPartIsSelected.bind(this)
		this.initializeGame = this.initializeGame.bind(this)
		window.onunload = function () { window.location.href = '/' };

		animalService.getAll()  // here we fill the allAnimals array and connect selected-attribute for each row 
			.then(response => {
				const animals = response.data.map(animal => {
					return { ...animal, selected: true }
				})
				/*
				Here we try to fetch emojis for the animals.
				*/
				for (var key in animals) {
					var emo = emoji
					if (animals[key].name.toLowerCase() === 'kissa') {
						emo = emo.get('cat')
						console.log(emo)
						animals[key].emoji = emo
					}
					if (animals[key].name.toLowerCase() === 'koira') {
						emo = emo.get('dog')
						console.log(emo)
						animals[key].emoji = emo
					}
					if (animals[key].name.toLowerCase() === 'hevonen') {	
						emo = emo.get('horse')
						console.log(emo)
						animals[key].emoji = emo
					}
					if (animals[key].name.toLowerCase() === 'nauta') {
						emo = emo.get('cow')
						console.log(emo)
						animals[key].emoji = emo
					}

				}
				this.setState({ allAnimals: animals })
			})

		bodyPartService.getAll()    // here we fill the allBodyParts array and connect selected-attribute for each row 
			.then(response => {
				const bodyParts = response.data.map(bodyPart => {
					return { ...bodyPart, selected: true }
				})
				this.setState({ allBodyParts: bodyParts })
			})

		imageService.getAll()  // here we fill the image array
			.then(response => {
				const imagesWithBone = response.data.filter(image => image.bone !== undefined)
				console.log(imagesWithBone)
				this.setState({ allImages: imagesWithBone })
			})
		console.log(this.state.allImages)
	}

	componentDidMount() {
		const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			this.setState({ user })
		}
	}

	changeGameLength(event) {
		this.setState({ gameLength: [event.target.value] })
		console.log('Pelin pituus on nyt ... ' + this.state.gameLength)
	}

	changeAnimal(i, event) {
		const animals = this.state.allAnimals
		console.log(animals)
		console.log(event.target)
		if (animals[i].selected)
			animals[i].selected = false
		else {
			animals[i].selected = true
		}
		this.setState({ allAnimals: animals })
		console.log(this.state.allAnimals)
	}

	// If the id of the calling event is 1, change the boolean value
	// of index 1 of array bodyParts. The method creates a copy
	// of the existing array, modifies it, and replaces the old array
	// in this.state with it. Hopefully.
	toggleCheck(i, event) {
		const bodyParts = this.state.allBodyParts
		console.log(bodyParts)
		console.log(event.target)
		if (bodyParts[i].selected)
			bodyParts[i].selected = false
		else {
			bodyParts[i].selected = true
		}
		this.setState({ allbodyParts: bodyParts })
		console.log(this.state.allBodyParts)
	}

	// At least one body part needs to be selected, so here
	// we check if none is.
	atLeastOneBodyPartIsSelected() {
		if (!this.state.allBodyParts[0].selected && !this.state.allBodyParts[1].selected
			&& !this.state.allBodyParts[2].selected && !this.state.allBodyParts[3].selected) {
			this.props.setMessage('Valitse ainakin yksi ruumiinosa.', 'danger')
		} else {
			this.initializeGame()
		}
	}

	// Returns the state
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

		// Filters the image array into containing only the images of the user chosen animal
		// NOTE: While the use of filter here is very clever, I think the number of images 
		// should be actually matched with the number of questions chosen by the user.
		// In a situation where there's not enough distinct bones to fill up a questionnaire,
		// then bones should be repeated (using alt images when possible).

		// Filtering the approved images on animals
		let pics = this.state.allImages.filter(image => {
			const animalIds = chosenAnimals.map(chosenAnimal => chosenAnimal.id)
			if (image.animal !== undefined) {
				return animalIds.includes(image.animal._id)
			}
			return null
		})
		console.log(pics)

		// Filtering the approved images on body parts
		pics = pics.filter(image => {
			const bodyPartIds = chosenBodyParts.map(chosenBodyPart => chosenBodyPart.id)
			return bodyPartIds.includes(image.bone.bodyPart)
		})		
		console.log(pics)

		// If criteria doesn't fulfill the game won't launch
		if (pics.length === 0) {
			this.props.setMessage('Peliä ei voitu luoda halutuilla asetuksilla', 'danger')
		} else {
      for(let animal of chosenAnimals) {
        delete animal.emoji
        delete animal.selected
      }
      for (let bodyPart of chosenBodyParts) {
        delete bodyPart.selected
      }
      this.setState({ images: pics })
      this.setState({ animals : chosenAnimals })
      this.setState({ bodyParts: chosenBodyParts })
			this.setState({ redirect: true })
		}
		console.log(pics)

	}

	// This starts the game
	render() {
		let i = parseInt(localStorage.getItem('styleIndex'), 10)
		// Here we inject the visual style specific colors into the css. Each visual style has a primary, secondary and tertiary color (accent).
		injectGlobal`
		:root {  
	     --highlight: ${this.state.allStyles[i].highlight}
		  --primary: ${this.state.allStyles[i].primary}
		  --secondary: ${this.state.allStyles[i].secondary}
		  --tertiary: ${this.state.allStyles[i].tertiary}
		  }
		}`

		if (this.state.redirect) {
      this.props.gameInitialization(this.state.gameLength, this.state.images, this.state.user, 
        this.props.location.state.gamemode, this.state.animals, this.state.bodyParts)
			return (
				<Redirect to={{
					pathname: '/game',
					state: {
						allStyles: this.state.allStyles,
						styleIndex: this.state.styleIndex,
						gamemode: this.state.gamemode
					  }
				}} />
			)
		}

		// Creating an animal menu
		const selectAnimal = this.state.allAnimals.map((animal, i) => {
			return <label className="checkbox-inline"><input type="checkbox" id={"animal" + i} defaultChecked onClick={this.changeAnimal.bind(this, i)}></input>{animal.emoji}{animal.name}</label>
		})

		// Creating a body part menu
		const selectBodyPart = this.state.allBodyParts.map((bodyPart, i) => {
			return <label className="checkbox-inline"><input type="checkbox" id={"bodyPart" + i} defaultChecked onClick={this.toggleCheck.bind(this, i)}></input>{bodyPart.name}</label>
		})

		// As a general note about using forms w/ NodeJS... A single grouping of radio buttons (single choice) is identified by identical "name" parameter. Separate values within such a grouping are marked with distinct "value" parameters.
		return (
			<div className={this.state.allStyles[i].overlay}>
				<div className={this.state.allStyles[i].background}>
					<div className={this.state.allStyles[i].style}>
						<div id="App" className="App menu">
							<div
								className={this.state.allStyles[i].flairLayerA}>
							</div>
							<div
								className={this.state.allStyles[i].flairLayerB}>
							</div>
							<div
								className={this.state.allStyles[i].flairLayerC}>
							</div>
							<div
								className={this.state.allStyles[i].flairLayerD}>
							</div>
							<h2>Luupelivalinnat:</h2>
							<div>
								<Message />
							</div>
							<div className="transbox">
								<div className="container">
									<div className="col-md-12">
										<h3 className="form-header">Valitse eläin:</h3>
										<form>
											{selectAnimal}
										</form>
									</div>
								</div>
								<div className="container">
									<div className="col-md-12">
										<h3 className="form-header">Valitse ruumiinosa:</h3>
										<form>
											{selectBodyPart}
										</form>
									</div>
								</div>
								<div className="container">
									<div className="col-md-12">
										<h3 className="form-header">Luupelin pituus:</h3>
										<form>
											<label className="radio-inline">
												<input
													type="radio"
													id="gameLengthShort"
													value="3"
													onClick={this.changeGameLength.bind(this)}
													name="length"
												/>
												3
											</label>
											<label className="radio-inline">
												<input
													type="radio"
													id="gameLengthMedium"
													value="5"
													onClick={this.changeGameLength.bind(this)}
													name="length"
													defaultChecked
												/>
												5
											</label>
											<label className="radio-inline">
												<input
													type="radio"
													id="gameLengthLong"
													value="7"
													onClick={this.changeGameLength.bind(this)}
													name="length"
												/>
												7
											</label>
										</form>
									</div>
								</div>
								<div className="container">
									<div className="col-md-12">
										<h3 className="form-header">Vaikeusaste:</h3>
										<form>
											<label className="radio-inline">
												<input
													type="radio"
													id="gameEasy"
													value="easy"
													name="difficultylevel"
												/>
												Luupää (helppo)
											</label>
											<label className="radio-inline">
												<input
													type="radio"
													id="gameMedium"
													value="medium"
													name="difficultylevel"
													defaultChecked
												/>
												Normaali
											</label>
											<label className="radio-inline">
												<input
													type="radio"
													id="gameHard"
													value="hard"
													name="difficultylevel"
												/>
												Luunkova (vaikea)
											</label>
										</form>
										<div className="btn-group wide settingspage GameButton">
											<button id="luupeliinButton" onClick={this.atLeastOneBodyPartIsSelected}>Luupeliin >></button>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="btn-group">
							<button className="gobackbutton"><Link to='/gamemode'>Takaisin</Link></button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		game: state.game
	}
}

const mapDispatchToProps = {
	gameInitialization,
	setMessage
}

const ConnectedGameSettings = connect(
	mapStateToProps,
	mapDispatchToProps
)(GameSettings)
export default ConnectedGameSettings
