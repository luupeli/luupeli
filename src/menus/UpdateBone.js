import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import boneService from '../services/bones'
import imageService from '../services/images'
import bodyPartService from '../services/bodyParts'
import animalService from '../services/animals'
import WGMessage from '../games/writinggame/WGMessage'

class UpdateBone extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			submitted: false,
			boneId: this.props.location.state.boneId,
			nameLatin: this.props.location.state.nameLatin,
			name: this.props.location.state.name,
			altNameLatin: this.props.location.state.altNameLatin,
			description: this.props.location.state.description,
			attempts: this.props.location.state.attempts,
			correctAttempts: this.props.location.state.correctAttempts,
			bodyPart: this.props.location.state.bodyPart,
			boneAnimals: this.props.location.state.boneAnimals,
			newImages: [],
			images: [],
			animals: [],
			bodyParts: [],
			user: null
		};

		this.handleChange = this.handleChange.bind(this)
		this.handleAddImage = this.handleAddImage.bind(this)
		this.handleDeleteNewImage = this.handleDeleteNewImage.bind(this)
		this.handleDeleteImage = this.handleDeleteImage.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleDelete = this.handleDelete.bind(this)
		this.handleNewImageChange = this.handleNewImageChange.bind(this)
		this.handleImageChange = this.handleImageChange.bind(this)
		this.validateNameLatin = this.validateNameLatin.bind(this)
		this.validateImages = this.validateImages.bind(this)
		this.fetchAnimals = this.fetchAnimals.bind(this)
		this.fetchBodyparts = this.fetchBodyparts.bind(this)
		this.uploadImage = this.uploadImage.bind(this)
		this.updateImage = this.updateImage.bind(this)
		this.postImage = this.postImage.bind(this)
		this.updateBone = this.updateBone.bind(this)
		this.getBoneAnimals = this.getBoneAnimals.bind(this)
		this.failureMessage = this.failureMessage.bind(this)
		this.markForDelete = this.markForDelete.bind(this)
	}

	//GET images related to this bone from DB and store them in state for rendering.
	//Add a deleted flag to each image to mark images the user wants to delete.
	//GET animals and bodyParts and store them in state for later use.
	componentDidMount() {
		boneService.get(this.state.boneId)
			.then((response) => {
				const imagesWithDeletionFlag = response.data.images
				imagesWithDeletionFlag.forEach((image) => image.deleted = false)
				this.setState({ images: imagesWithDeletionFlag })
			})
			.catch((error) => {
				console.log(error)
			})
		this.fetchAnimals()
		this.fetchBodyparts()

		const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			this.setState({ user })
		}
	}

	//Adds a new "empty file" to newImages list when user clicks a button to add more images.
	//newImages is used to dynamically render correct amount of file & difficulty input elements in the update form
	handleAddImage(event) {
		const animal = this.state.animals.filter((animal) => animal.name === "Koira")[0]
		const expandList = this.state.newImages.concat({ difficulty: "1", description: "", photographer: "", copyright: "", attempts: 0, correctAttempts: 0, handedness: "", animal: animal.id })
		this.setState({ newImages: expandList })
	}

	//Removes element at index i from this.state.newImages (and thus the corresponding file input element from the form)
	handleDeleteNewImage(i, event) {
		//this.setState({ newImages: this.state.newImages.filter((element, index) => {return index !== i}) })
		this.setState({ newImages: this.state.newImages.splice(0, (this.state.newImages.length - 1)) })
	}

	//Removes element at index i from this.state.images and deletes the corresponding image from the database.
	handleDeleteImage(i) {
		console.log(i)
		console.log(this.state.images)
		console.log(this.state.images[i])
		console.log(this.state.images[i]._id)
		imageService.remove(this.state.images[i]._id)
			.then((response) => {
				console.log(response)
				if (response.status !== 200) {
					this.failureMessage()
				}
			})
			.catch((error) => {
				console.log(error)
			})
		this.setState({ images: this.state.images.filter((element, index) => { return index !== i }) })
	}

	//When user changes the value of a field in the form, reflect that change in state.
	//event.target.name must correspond both to a input field name and a state variable name.
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value })
	}

	//GET all animals from database for later use
	fetchAnimals() {
		animalService.getAll()
			.then((response) => {
				this.setState({ animals: response.data })
			})
			.catch((error) => {
				console.log(error)
			})
	}

	//GET all bodyParts from database for later use
	fetchBodyparts() {
		bodyPartService.getAll()
			.then((response) => {
				console.log(response)
				this.setState({ bodyParts: response.data })
			})
			.catch((error) => {
				console.log(error)
			})
	}

	//Marks or unmarks an image for deletion, depending on the previous state of deleted flag
	markForDelete(i, event) {
		const modifiedImages = this.state.images
		if (modifiedImages[i].deleted) {
			modifiedImages[i].deleted = false
		} else {
			modifiedImages[i].deleted = true
		}
		this.setState({ images: modifiedImages })
	}

	//Upload a new image to server via database
	async uploadImage(i) {
		let data = new FormData()
		data.append('image', this[`fileInput${i}`].files[0])
		data.append('name', this[`fileInput${i}`].files[0].name)

		return await imageService.upload(data)
			.then((response) => {
				return response.data.url
				if (response.status !== 200) {
					this.failureMessage()
				}
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
				if (response.status !== 200) {
					this.failureMessage()
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	//PUT updated fields of an existing image to database
	updateImage(i) {
		imageService.update(this.state.images[i]._id, {
			difficulty: this.state.images[i].difficulty,
			photographer: this.state.images[i].photographer,
			description: this.state.images[i].description,
			attempts: this.state.images[i].attempts,
			correctAttempts: this.state.images[i].correctAttempts,
			handedness: this.state.images[i].handedness,
			animal: this.state.images[i].animal
		})
			.then((response) => {
				if (response.status !== 200) {
					this.failureMessage()
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	//Display an error message to the user
	failureMessage() {
		this.wgmessage.mountTimer()
		this.wgmessage.setMessage('Jokin meni pieleen.')
		this.wgmessage.setStyle("alert alert-danger")
	}

	//PUT updated fields of the bone to database
	async updateBone(boneAnimals) {
		const bodyPartObj = this.state.bodyParts.filter((bodyPart) => bodyPart.name === this.state.bodyPart)[0]

		return await boneService.update(this.state.boneId, {
			nameLatin: this.state.nameLatin,
			name: this.state.name,
			bodyPart: bodyPartObj.id,
			altNameLatin: this.state.altNameLatin,
			description: this.state.description,
			animals: boneAnimals
		})
			.then((response) => {
				return response.data

				if (response.status !== 200) {
					this.failureMessage()
				}
			})
			.catch((error) => {
				console.log(error)
			})
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

	//Sends bone-related values from this.state to the database.
	//Updates difficulties for all images already in the database.
	//Uploads and posts any new images to the database.
	//Prepare a WGMessage to notify user of a failed or successful save.
	async handleSubmit(event) {
		event.preventDefault()

		if (!this.validateNameLatin() || !this.validateImages()) {
			return
		}

		for (var i = 0; i < this.state.images.length; i++) {
			if (!this.state.images[i].deleted) {
				this.updateImage(i)
			} else {
				this.handleDeleteImage(i)
			}
		}

		var bone = {};
		var imageUrl = "";

		var boneAnimals = this.getBoneAnimals()

		bone = await this.updateBone(boneAnimals)

		for (var j = 0; j < this.state.newImages.length; j++) {
			if (this[`fileInput${j}`].files.length > 0) {
				imageUrl = await this.uploadImage(j)
				this.postImage(j, imageUrl, bone)
			}
		}

		//TODO: only show this message if there is no existing failure message
		this.wgmessage.mountTimer()
		this.wgmessage.setMessage('Muutokset tallennettu!')
		this.wgmessage.setStyle("alert alert-success")
	}

	//Delete this bone from DB.
	//Set this.state.submitted to true in preparation for redirect to listing.
	//Prepare a message to notify user of the success/failure of the delete.
	handleDelete(event) {
		boneService.remove(this.state.boneId)
			.then((response) => {
				if (response.status !== 200) {
					this.failureMessage()
				} else {
					this.setState({ submitted: true })
				}
			})
			.catch((error) => {
				console.log(error)
				this.wgmessage.mountTimer()
				this.wgmessage.setMessage('Poisto epäonnistui :(')
				this.wgmessage.setStyle("alert alert-danger")
			})

		//TODO: only show this message if there is no existing failure message
		this.wgmessage.mountTimer()
		this.wgmessage.setMessage('Poistettu!')
		this.wgmessage.setStyle("alert alert-success")
	}

	//When user changes a field related to image i in the form, reflect that change in state.
	//i: list index of the image where a field was changed
	handleImageChange(i, event) {
		const modifiedList = this.state.images
		modifiedList[i][event.target.name] = event.target.value
		this.setState({ images: modifiedList })
	}

	//When user changes a field relatod to newImage i in the form, reflect that change in state.
	//i: list index of the newImage where a field was changed
	handleNewImageChange(i, event) {
		const modifiedList = this.state.newImages
		modifiedList[i][event.target.name] = event.target.value
		this.setState({ newImages: modifiedList })
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

	//TODO: check that the bone has at least one image
	//Is this even needed?
	validateImages() {
		return true
	}

	//If this.state.submitted is true (i.e. bone data has been deleted), redirect to listing.
	//Otherwise render bone update form.
	render() {
		if (this.state.submitted) {
			return (
				<Redirect to="/listing" />
			)
		}

		return (
			<div className="scrolling-menu">
				<div className="App">
					<div>
						<WGMessage ref={instance => this.wgmessage = instance} />
					</div>
					<Link to='/listing'>
						<button id="backToListing" className="btn btn-default pull-right">Takaisin listaukseen</button>
					</Link>
					<br />
					<form onSubmit={this.handleSubmit} enctype="multipart/form-data">
						<div className="form-group has-feedback">
							<label className="pull-left">Latinankielinen nimi </label>
							<input type="text" id="nameLatin" name="nameLatin" value={this.state.nameLatin} className="form-control" onChange={this.handleChange} />
							<span className="glyphicon glyphicon-asterisk form-control-feedback"></span>
						</div>
						<label className="pull-left">Vaihtoehtoinen latinankielinen nimi</label>
						<input
							type="text"
							id="altNameLatin"
							name="altNameLatin"
							value={this.state.altNameLatin}
							className="form-control"
							onChange={this.handleChange}
						/>
						<label className="pull-left">Suomenkielinen nimi</label>
						<input
							type="text"
							id="name"
							name="name"
							value={this.state.name}
							className="form-control"
							onChange={this.handleChange}
						/>
						<label className="pull-left">Kuvaus</label>
						<input
							type="text"
							id="description"
							name="description"
							value={this.state.description}
							className="form-control"
							onChange={this.handleChange}
						/>
						<label className="pull-left">Ruumiinosa</label>
						<select
							id="bodyPart"
							name="bodyPart"
							className="form-control"
							value={this.state.bodyPart}
							onChange={this.handleChange}
						>
							<option value="Eturaaja">Eturaaja</option>
							<option value="Takaraaja">Takaraaja</option>
							<option value="Vartalo">Vartalo</option>
							<option value="Pää">Pää</option>
						</select>
						<span className="clearfix">
							<label className="pull-left">Ladatut kuvat</label>
						</span>
						<ul className="list-group">
							{this.state.images.map((file, i) => <li key={file.id} className="list-group-item clearfix">
								<span className="pull-left">
									{
										file.url
										+ (this.state.images[i].deleted
											? " (Poistetaan tallennuksen yhteydessä)" : "")
									}
								</span>
								<br />
								<div className=
									{
										"input-group "
										+ (this.state.images[i].deleted
											? 'hidden'
											: 'show')
									}
								>
									<label className="pull-left">Vaikeustaso</label>
									<select
										name="difficulty"
										className="form-control"
										value={this.state.images[i].difficulty}
										onChange={this.handleImageChange.bind(this, i)}
									>
										<option value={1}>Helppo</option>
										<option value={100}>Vaikea</option>
									</select>
									<label className="pull-left">Puoli</label>
									<select
										name="handedness"
										className="form-control"
										value={this.state.images[i].handedness}
										onChange={this.handleImageChange.bind(this, i)}>
										<option value="">Ei valintaa</option>
										<option value="dex">dex</option>
										<option value="sin">sin</option>
									</select>
									<label className="pull-left">Eläin</label>
									<select
										name="animal"
										className="form-control"
										value={this.state.images[i].animal}
										onChange={this.handleImageChange.bind(this, i)}
									>
										{
											this.state.animals.map((animal, i) =>
												<option key={animal.id} value={animal.id}>
													{animal.name}
												</option>)
										}
									</select>
									<label className="pull-left">Kuvaus</label>
									<input
										type="text"
										name="description"
										value={this.state.images[i].description}
										className="form-control"
										onChange={this.handleImageChange.bind(this, i)}
									/>
									<label className="pull-left">Valokuvaaja</label>
									<input
										type="text"
										name="photographer"
										value={this.state.images[i].photographer}
										className="form-control"
										onChange={this.handleImageChange.bind(this, i)}
									/>
									<label className="pull-left">Tekijänoikeus</label>
									<input
										type="text"
										name="copyright"
										value={this.state.images[i].copyright}
										className="form-control"
										onChange={this.handleImageChange.bind(this, i)}
									/>
								</div>
								<button
									id={"deleteImageButton" + i}
									type="button" className="btn btn-danger pull-right"
									onClick={this.markForDelete.bind(this, i)}
								>
									{(this.state.images[i].deleted ? "Peruuta poisto" : "Poista")}
								</button>
							</li>)}
						</ul>
						<span className="clearfix">
							<label className="pull-left">
								Uudet kuvat
							</label>
						</span>
						<ul className="list-group">
							{
								this.state.newImages.map((file, i) =>
									<li key={file.id}
										className="list-group-item clearfix">
										<input
											type="file"
											accept="image/x-png,image/jpeg"
											id="boneImage"
											ref={input => { this[`fileInput${i}`] = input }} />
										<div className="input-group">
											<label className="pull-left">Vaikeustaso</label>
											<select
												name="difficulty"
												className="form-control"
												value={this.state.newImages[i].difficulty}
												onChange={this.handleNewImageChange.bind(this, i)}
											>
												<option value="1">Helppo</option>
												<option value="100">Vaikea</option>
											</select>
											<label className="pull-left">Puoli</label>
											<select
												name="handedness"
												className="form-control"
												value={this.state.newImages[i].handedness}
												onChange={this.handleNewImageChange.bind(this, i)}
											>
												<option value="">Ei valintaa</option>
												<option value="dex">dex</option>
												<option value="sin">sin</option>
											</select>
											<label className="pull-left">Eläin</label>
											<select
												name="animal"
												className="form-control"
												value={this.state.newImages[i].animal}
												onChange={this.handleNewImageChange.bind(this, i)}
											>
												{
													this.state.animals.map((animal, i) =>
														<option key={animal.id} value={animal.id}>
															{animal.name}
														</option>)
												}
											</select>
											<label className="pull-left">Kuvaus</label>
											<input
												type="text"
												name="description"
												value={this.state.newImages[i].description}
												className="form-control"
												onChange={this.handleNewImageChange.bind(this, i)}
											/>
											<label className="pull-left">Valokuvaaja</label>
											<input
												type="text"
												name="photographer"
												value={this.state.newImages[i].photographer}
												className="form-control"
												onChange={this.handleNewImageChange.bind(this, i)}
											/>
											<label className="pull-left">Tekijänoikeus</label>
											<input
												type="text"
												name="copyright"
												value={this.state.newImages[i].copyright}
												className="form-control"
												onChange={this.handleNewImageChange.bind(this, i)}
											/>
										</div>
									</li>)
							}
							<li className="list-group-item clearfix">
								<span className="btn-toolbar">
									<button
										id="addNewImageFieldButton"
										type="button"
										className="btn btn-info pull-right"
										onClick={this.handleAddImage}>
										Lisää kuvakenttä
									</button>
									<button
										id="removeNewImageFieldButton"
										type="button"
										className="btn btn-danger pull-right"
										onClick={this.handleDeleteNewImage}>
										Poista kuvakenttä
									</button>
								</span>
							</li>
						</ul>
						<div className="btn-toolbar">
							<button
								id="submitUpdateButton"
								type="submit" className="btn btn-info pull-right">
								Tallenna muutokset
							</button>
							<button
								id="deleteBoneButton"
								type="button"
								onClick={this.handleDelete}
								className="btn btn-danger pull-right">
								Poista luu
						</button>
						</div>
					</form>
				</div>
			</div>
		)
	}
}

export default UpdateBone
