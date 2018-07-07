import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import boneService from '../services/bones'
import imageService from '../services/images'
import bodyPartService from '../services/bodyParts'
import animalService from '../services/animals'
import WGMessage from '../games/writinggame/WGMessage'

//Creates a text input with label text and feedback symbol
const TextInputWithFeedback = (props) => {
	return (
		<div className="form-group has-feedback">
			<label className="pull-left">{props.label}</label>
			<input type="text" id={props.id} className="form-control" />
			<span className="glyphicon glyphicon-asterisk form-control-feedback"></span>
		</div>
	)
}

//Creates a text input with label text and no feedback symbol
const TextInputWithoutFeedback = (props) => {
	return (
		<div className="form-group">
			<label className="pull-left">{props.label}</label>
			<input type="text" id={props.id} className="form-control" />
		</div>
	)
}

//Creates a dropdown menu with label text and options mapped from a list of lists containing option value attribute and the text between option tags
const DropdownInput = (props) => {
	return (
		<div className="form-group">
			<label className="pull-left">{props.label}</label>
			<select id={props.id} className="form-control">
				{props.values.map(value => <option key={value.id} value={value[0]}>{value[1]}</option>)}
			</select>
		</div>
	)
}

const ImageInput = (props) => {
	return (
		<div className="form-group">
			<label className="pull-left">Kuva</label>
			<input type="file" accept="image/x-png,image/jpeg,image/gif" id={props.id} multiple="multiple" />
			<span className="help-block">Voit valita useamman kuvan painamalla Ctrl-näppäintä ja klikkaamalla haluamiasi kuvia.</span>
			<label>Kuvan vaikeustaso</label>
			<input type="submit" value="Tallenna" className="btn btn-info" />
		</div>
	)
}

class AddBone extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			submitted: false,
			nameLatin: "",
			name: "",
			bodyPart: "Eturaaja",
			description: "",
			altNameLatin: "",
			images: [],
			newImages: [],
			animals: [],
			bodyParts: []
		};

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleNewImageChange = this.handleNewImageChange.bind(this)
		this.resetFields = this.resetFields.bind(this)
		this.validateNameLatin = this.validateNameLatin.bind(this)
		this.validateImages = this.validateImages.bind(this)
		this.uploadImage = this.uploadImage.bind(this)
		this.postImage = this.postImage.bind(this)
		this.postBone = this.postBone.bind(this)
		this.handleAddImage = this.handleAddImage.bind(this)
		this.handleRemoveNewImage = this.handleRemoveNewImage.bind(this)
		this.getBoneAnimals = this.getBoneAnimals.bind(this)
	}

	//GET animals and bodyParts
	componentDidMount() {
		animalService.getAll()
			.then((response) => {
				this.setState({ animals: response.data })
			})
			.catch((error) => {
				console.log(error)
			})

		bodyPartService.getAll()
			.then((response) => {
				var bodyParts = response.data
				console.log(response.data)
				this.setState({ bodyParts: bodyParts })
			})
			.catch((error) => {
				console.log(error)
			})
	}

	validateImages() {
		return true
	}

	//Adds a new "empty file" to newImages list when user clicks a button to add more images.
	//newImages is used to dynamically render correct amount of file & difficulty input elements in the update form
	handleAddImage(event) {
		const animal = this.state.animals.filter((animal) => animal.name === "Koira")[0]
		const expandList = this.state.newImages.concat({ difficulty: "1", description: "", photographer: "", copyright: "", attempts: 0, correctAttempts: 0, handedness: "", animal: animal.id })
		this.setState({ newImages: expandList })
	}

	//Removes element at index i from this.state.newImages (and thus the corresponding file input element from the form)
	handleRemoveNewImage(i, event) {
		//this.setState({ newImages: this.state.newImages.filter((element, index) => {return index !== i}) })
		this.setState({ newImages: this.state.newImages.splice(0, (this.state.newImages.length - 1)) })
	}

	//When user changes the value of a field in the form, reflect that change in state.
	//event.target.name must correspond both to a input field name and a state variable name.
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value })
	}

	//When user changes a field relatod to newImage i in the form, reflect that change in state.
	//i: list index of the newImage where a field was changed
	handleNewImageChange(i, event) {
		const modifiedList = this.state.newImages
		modifiedList[i][event.target.name] = event.target.value
		this.setState({ newImages: modifiedList })
	}

	//Generate and return a list of all animals related to this bone, with no duplicate animals
	getBoneAnimals() {
		var boneAnimals = []
		var animalTally = this.state.animals
		animalTally.forEach((animal) => animal.exists = false)

		for (var i = 0; i < this.state.images.length; i++) {
			const currAnimal = animalTally.filter((animal) => animal.id === this.state.images[i].animal)[0]

			if (!currAnimal.exists) {
				animalTally.map((animal) => { if (animal.name === currAnimal.name) { animal.exists = true } })
				boneAnimals = boneAnimals.concat(currAnimal.id)
			}

			this.updateImage(i)
		}

		for (var k = 0; k < this.state.newImages.length; k++) {
			if (this[`fileInput${k}`].files.length > 0) {

				const currAnimal = animalTally.filter((animal) => animal.id === this.state.newImages[k].animal)[0]

				if (!currAnimal.exists) {
					animalTally.map((animal) => { if (animal.name === currAnimal.name) { animal.exists = true } })
					boneAnimals = boneAnimals.concat(currAnimal.id)
				}
			}
		}

		return boneAnimals
	}

	//Upload a new image to server via database
	async uploadImage(i) {
		var imageUrl = ""

		let data = new FormData()
		data.append('image', this[`fileInput${i}`].files[0])
		data.append('name', this[`fileInput${i}`].files[0].name)

		return await imageService.upload(data)
			.then((response) => {
				return response.data.url
			})
			.catch((error) => {
				console.log(error)
			})
	}

	//POST an uploaded new image to database
	postImage(i, imageUrl, bone) {
		imageService.create({
			difficulty: this.state.newImages[i].difficulty,
			bone: bone.id,
			url: imageUrl,
			photographer: this.state.newImages[i].photographer,
			description: this.state.newImages[i].description,
			attempts: this.state.newImages[i].attempts,
			correctAttempts: this.state.newImages[i].correctAttempts,
			handedness: this.state.newImages[i].handedness,
			animal: this.state.newImages[i].animal
		})
			.then((response) => {
				console.log(response)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	//POST this bone to database
	async postBone(boneAnimals) {
		const bodyPartObj = this.state.bodyParts.filter((bodyPart) => bodyPart.name === this.state.bodyPart)[0]
		var boneResponse = "";

		return await boneService.create({
			nameLatin: this.state.nameLatin,
			name: this.state.name,
			altNameLatin: this.state.altNameLatin,
			description: this.state.description,
			animals: boneAnimals,
			bodyPart: bodyPartObj.id
		})
			.then((response) => {
				return response.data
			})
			.catch((error) => {
				console.log(error)
				this.wgmessage.mountTimer()
				this.wgmessage.setMessage('Tallentaminen epäonnistui :(')
				this.wgmessage.setStyle("alert alert-danger")
			})
	}

	//Sends bone-related values from this.state to the database.
	//Uploads and posts any new images to the database.
	//Prepare a WGMessage to notify user of a failed or successful save.
	async handleSubmit(event) {
		event.preventDefault()

		if (!this.validateNameLatin() || !this.validateImages()) {
			return
		}

		var errored = false
		var bone = {}
		var imageUrl = ""
		var boneAnimals = this.getBoneAnimals

		bone = await this.postBone(boneAnimals)

		for (var j = 0; j < this.state.newImages.length; j++) {
			if (this[`fileInput${j}`].files.length > 0) {
				imageUrl = await this.uploadImage(j)
				this.postImage(j, imageUrl, bone)
			}
		}

		this.wgmessage.mountTimer()
		this.wgmessage.setMessage('Uusi luu lisätty! Voit nyt lisätä toisenkin luun tai palata nappulasta takaisin listausnäkymään.')
		this.wgmessage.setStyle("alert alert-success")
		this.resetFields()
	}

	//Check that the bone has a latin name
	validateNameLatin() {
		if (this.state.nameLatin.length >= 1) {
			return true
		}
		this.wgmessage.mountTimer()
		this.wgmessage.setMessage('Anna latinankielinen nimi.')
		this.wgmessage.setStyle("alert alert-danger")
		return false
	}

	//Sets fields to default values in preparation for the addition of another new bone.
	resetFields() {
		this.setState({
			nameLatin: "",
			name: "",
			altNameLatin: "",
			bodyPart: "Eturaaja",
			description: "",

			newImages: []
		})
	}

	//If this.state.submitted is true (currently never), redirect to listing.
	//Otherwise render bone add form.
	render() {
		if (this.state.submitted) {
			return (
				<Redirect to="/listing" />
			)
		}

		return (
			<div className="scrolling-menu">
				<div className="App">
					<div id="">
						<WGMessage ref={instance => this.wgmessage = instance} />
					</div>
					<Link to='/listing'><button id="backToListing"className="btn btn-default pull-right">Takaisin listaukseen</button></Link><br />
					<form enctype="multipart/form-data" onSubmit={this.handleSubmit}>
						<div className="form-group has-feedback">
							<label className="pull-left">Latinankielinen nimi </label>
							<input type="text" name="nameLatin" id="nameLatin" value={this.state.nameLatin} className="form-control" onChange={this.handleChange} /><span className="glyphicon glyphicon-asterisk form-control-feedback"></span>
						</div>
						<label className="pull-left">Vaihtoehtoinen latinankielinen nimi</label>
						<input type="text" name="altNameLatin" id="altNameLatin" value={this.state.altNameLatin} className="form-control" onChange={this.handleChange} />
						<label className="pull-left">Suomenkielinen nimi</label>
						<input type="text" name="name" id ="name" value={this.state.name} className="form-control" onChange={this.handleChange} />
						<label className="pull-left">Kuvaus</label>
						<input type="text" name="description" id ="description" value={this.state.description} className="form-control" onChange={this.handleChange} />
						<label className="pull-left">Ruumiinosa</label>
						<select name="bodyPart" id="bodyPart" className="form-control" value={this.state.bodyPart} onChange={this.handleChange}>
							<option value="Eturaaja">Eturaaja</option>
							<option value="Takaraaja">Takaraaja</option>
							<option value="Vartalo">Vartalo</option>
							<option value="Pää">Pää</option>
						</select>
						<ul className="list-group">
							{this.state.newImages.map((file, i) => <li key={file.id} className="list-group-item clearfix">
								<input type="file" accept="image/x-png,image/jpeg" id="boneImage" ref={input => { this[`fileInput${i}`] = input }} />
								<div className="input-group">
									<label className="pull-left">Vaikeustaso</label>
									<select name="difficulty" className="form-control" value={this.state.newImages[i].difficulty} onChange={this.handleNewImageChange.bind(this, i)}>
										<option value="1">Helppo</option>
										<option value="100">Vaikea</option>
									</select>
									<label className="pull-left">Puoli</label>
									<select name="handedness" className="form-control" value={this.state.newImages[i].handedness} onChange={this.handleNewImageChange.bind(this, i)}>
										<option value="">Ei valintaa</option>
										<option value="dex">dex</option>
										<option value="sin">sin</option>
									</select>
									<label className="pull-left">Eläin</label>
									<select name="animal" className="form-control" value={this.state.newImages[i].animal} onChange={this.handleNewImageChange.bind(this, i)}>
										{this.state.animals.map((animal, i) => <option key={animal.id} value={animal.id}>{animal.name}</option>)}
									</select>
									<label className="pull-left">Kuvaus</label>
									<input type="text" name="description" value={this.state.newImages[i].description} className="form-control" onChange={this.handleNewImageChange.bind(this, i)} />
									<label className="pull-left">Valokuvaaja</label>
									<input type="text" name="photographer" value={this.state.newImages[i].photographer} className="form-control" onChange={this.handleNewImageChange.bind(this, i)} />
									<label className="pull-left">Tekijänoikeus</label>
									<input type="text" name="copyright" value={this.state.newImages[i].copyright} className="form-control" onChange={this.handleNewImageChange.bind(this, i)} />
								</div>
							</li>)}
							<li className="list-group-item clearfix">
								<span className="btn-toolbar">
									<button type="button" id="addNewImageFieldButton" className="btn btn-info pull-right" onClick={this.handleAddImage}>Lisää kuvakenttä</button>
									<button type="button" id="removeNewImageFieldButton" className="btn btn-danger pull-right" onClick={this.handleRemoveNewImage}>Poista kuvakenttä</button>
								</span>
							</li>
						</ul>
						<div id="addBone" className="btn-toolbar">
							<button type="submit" id="submitNewBoneButton" className="btn btn-info pull-right">Lisää luu</button>
						</div>
					</form>
				</div>
			</div>
		)
	}
}

export default AddBone
