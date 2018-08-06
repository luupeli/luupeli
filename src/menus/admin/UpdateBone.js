import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import boneService from '../../services/bones'
import imageService from '../../services/images'
import Message from '../../games/Message'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Label } from 'react-bootstrap'
import { connect } from 'react-redux'
import { setMessage } from '../../reducers/messageReducer'

class UpdateBone extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			notAdmin: false,
			submitted: false,
			boneId: '',
			nameLatin: '',
			name: '',
			altNameLatin: '',
			description: '',
			bodyPart: '',
			newImages: [],
			images: [],
			user: null
		}
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
		this.uploadImage = this.uploadImage.bind(this)
		this.updateImage = this.updateImage.bind(this)
		this.postImage = this.postImage.bind(this)
		this.postBone = this.postBone.bind(this)
		this.updateBone = this.updateBone.bind(this)
		this.getBoneAnimals = this.getBoneAnimals.bind(this)
		this.failureMessage = this.failureMessage.bind(this)
		this.markForDelete = this.markForDelete.bind(this)
		window.onunload = function () { window.location.href = '/' }
	}
	// GET images related to this bone from DB and store them in state for rendering.
	// Add a deleted flag to each image to mark images the user wants to delete.
	// GET animals and bodyParts and store them in state for later use.
	async componentDidMount() {
		if (this.props.boneId) {
			try {
				const bone = await boneService.get(this.props.boneId)
				console.log(bone)
				this.setState({
					boneId: bone.data.id,
					nameLatin: bone.data.nameLatin,
					altNameLatin: bone.data.altNameLatin,
					description: bone.data.description,
					name: bone.data.name,
					bodyPart: bone.data.bodyPart._id,
					attempts: bone.data.attempts,
					correctAttempts: bone.data.correctAttempts,
					images: bone.data.images.map(img => {
						return ({ ...img, deleted: false })
					})
				})
			} catch (e) {
				console.log(e)
			}
		}

		const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			if (user.role !== "ADMIN") {
				this.setState({ notAdmin: true })
			}
			this.setState({ user })
		} else {
			this.setState({ notAdmin: true })
		}
	}
	// Adds a new "empty file" to newImages list when user clicks a button to add more images.
	// newImages is used to dynamically render correct amount of file & difficulty input elements in the update form
	handleAddImage(event) {
		const animal = this.props.init.animals.filter((animal) => animal.name === "Ca")[0]
		const expandList = this.state.newImages.concat({ difficulty: "1", description: "", photographer: "", 
			copyright: "", attempts: 0, correctAttempts: 0, handedness: "", animal: animal.id })
		this.setState({ newImages: expandList })
	}
	// Removes element at index i from this.state.newImages (and thus the corresponding file input element from the form)
	handleDeleteNewImage(i, event) {
		// this.setState({ newImages: this.state.newImages.filter((element, index) => {return index !== i}) })
		this.setState({ newImages: this.state.newImages.splice(0, (this.state.newImages.length - 1)) })
	}
	// Removes element at index i from this.state.images and deletes the corresponding image from the database.
	handleDeleteImage(i) {
		console.log(i)
		console.log(this.state.images)
		console.log(this.state.images[i])
		console.log(this.state.images[i]._id)
		imageService.remove(this.state.images[i]._id)
			.then((response) => {
				console.log(response)
				if (response.status !== 204) {
					this.failureMessage()
				}
			})
			.catch((error) => {
				console.log(error)
			})
		this.setState({ images: this.state.images.filter((element, index) => { return index !== i }) })
	}
	// When user changes the value of a field in the form, reflect that change in state.
	// event.target.name must correspond both to a input field name and a state variable name.
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value })
	}

	// Marks or unmarks an image for deletion, depending on the previous state of deleted flag
	markForDelete(i, event) {
		const modifiedImages = this.state.images
		if (modifiedImages[i].deleted) {
			modifiedImages[i].deleted = false
		} else {
			modifiedImages[i].deleted = true
		}
		this.setState({ images: modifiedImages })
	}
	// Upload a new image to server via database
	async uploadImage(i) {
		let data = new FormData()
		data.append('image', this[`fileInput${i}`].files[0])
		data.append('name', this[`fileInput${i}`].files[0].name)

		return await imageService.upload(data)
			.then((response) => {
				if (response.status !== 200) {
					this.failureMessage()
				}
				return response.data.url
			})
			.catch((error) => {
				console.log(error)
			})
	}

	// POST this bone to database
	async postBone(boneAnimals) {
		return await boneService.create({
			nameLatin: this.state.nameLatin,
			name: this.state.name,
			altNameLatin: this.state.altNameLatin,
			description: this.state.description,
			animals: boneAnimals,
			bodyPart: this.state.bodyPart
		})
			.then((response) => {
				return response.data
			})
			.catch((error) => {
				console.log(error)
				this.props.setMessage('Tallentaminen epäonnistui :(', 'danger')
			})
	}

	// POST an uploaded new image to database
	postImage(i, imageUrl, bone) {
		imageService.create({
			difficulty: this.state.newImages[i].difficulty,
			bone: bone.id,
			url: imageUrl,
			photographer: this.state.newImages[i].photographer,
			copyright: this.state.newImages[i].copyright,
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
	// PUT updated fields of an existing image to database
	updateImage(i) {
		imageService.update(this.state.images[i]._id, {
			difficulty: this.state.images[i].difficulty,
			photographer: this.state.images[i].photographer,
			copyright: this.state.images[i].copyright,
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
	// Display an error message to the user
	failureMessage() {
		this.props.setMessage('Jokin meni pieleen.', 'danger')
	}

	// PUT updated fields of the bone to database
	async updateBone(boneAnimals) {
		return await boneService.update(this.state.boneId, {
			nameLatin: this.state.nameLatin,
			name: this.state.name,
			bodyPart: this.state.bodyPart,
			altNameLatin: this.state.altNameLatin,
			description: this.state.description,
			animals: boneAnimals
		})
			.then((response) => {
				if (response.status !== 200) {
					this.failureMessage()
				}
				return response.data
			})
			.catch((error) => {
				console.log(error)
			})
	}
	// Generate and return a list of all animals related to this bone, with no duplicate animals
	getBoneAnimals() {
		let animals = this.state.images.map(img => img.animal)
		animals = animals.concat(this.state.newImages.map(img => img.animal))
		const withoutDuplicates = Array.from(new Set(animals))
		return withoutDuplicates
	}
	// Sends bone-related values from this.state to the database.
	// Updates difficulties for all images already in the database.
	// Uploads and posts any new images to the database.
	// Prepare a WGMessage to notify user of a failed or successful save.
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
		var bone = {}
		var imageUrl = ""
		var boneAnimals = this.getBoneAnimals()

		if (this.props.boneId) {
			bone = await this.updateBone(boneAnimals)
		} else {
			bone = await this.postBone(boneAnimals)
		}

		for (var j = 0; j < this.state.newImages.length; j++) {
			if (this[`fileInput${j}`].files.length > 0) {
				imageUrl = await this.uploadImage(j)
				this.postImage(j, imageUrl, bone)
			}
		}
		// TODO: only show this message if there is no existing failure message
		if (this.props.boneId) {
		this.props.setMessage('Muutokset tallennettu.', 'success')
		} else {
		this.props.setMessage('Uusi luu lisätty! Voit nyt lisätä toisenkin luun tai palata nappulasta takaisin listausnäkymään.', 'success')
		this.resetFields()
		}
	}

	// Sets fields to default values in preparation for the addition of another new bone.
	resetFields() {
		this.setState({
			nameLatin: '',
			name: '',
			altNameLatin: '',
			description: '',
			bodyPart: '',
			newImages: [],
			images: [],
		})
	}
	// Delete this bone from DB.
	// Set this.state.submitted to true in preparation for redirect to listing.
	// Prepare a message to notify user of the success/failure of the delete.
	handleDelete(event) {
		boneService.remove(this.state.boneId)
			.then((response) => {
				console.log(response.status)
				if (response.status !== 204) {
					this.failureMessage()
				} else {
					this.setState({ submitted: true })
				}
			})
			.catch((error) => {
				console.log(error)
				this.props.setMessage('Poisto epäonnistui.', 'danger')
			})
		// TODO: only show this message if there is no existing failure message
		this.props.setMessage('Poistettu!.', 'success')
	}
	// When user changes a field related to image i in the form, reflect that change in state.
	// i: list index of the image where a field was changed
	handleImageChange(i, event) {
		const modifiedList = this.state.images
		modifiedList[i][event.target.name] = event.target.value
		this.setState({ images: modifiedList })
	}
	// When user changes a field relatod to newImage i in the form, reflect that change in state.
	// i: list index of the newImage where a field was changed
	handleNewImageChange(i, event) {
		const modifiedList = this.state.newImages
		modifiedList[i][event.target.name] = event.target.value
		this.setState({ newImages: modifiedList })
	}
	// Check that the bone has a latin name
	validateNameLatin() {
		if (this.state.nameLatin.length >= 1) {
			return true
		}
		this.props.setMessage('Anni latinankielinen nimi.', 'danger')
		return false
	}
	// TODO: check that the bone has at least one image
	// Is this even needed?
	validateImages() {
		return true
	}

	previewImage(input) {
		const reader = new FileReader()
		reader.onload = function () {
			const output = document.getElementById('new_image')
			output.src = reader.result
		}
		reader.readAsDataURL(input.target.files[0])
	}

	textField(id, text, value, onChange) {
		return (
			<FormGroup controlId={id}>
				<ControlLabel>{text}</ControlLabel>
				<FormControl
					type="text"
					id={id}
					name={id}
					value={value}
					placeholder={text}
					onChange={onChange}
				/>
			</FormGroup>
		)
	}


	// If this.state.submitted is true (i.e. bone data has been deleted), redirect to listing.
	// Otherwise render bone update form.
	render() {
		if (this.state.notAdmin) {
			return (
				<Redirect to="/login" />
			)
		} else if (this.state.submitted) {
			return (
				<Redirect to="/listing" />
			)
		}

		const imageWidth = () => {
			const windowWidth = Math.max(
				document.body.scrollWidth,
				document.documentElement.scrollWidth,
				document.body.offsetWidth,
				document.documentElement.offsetWidth,
				document.documentElement.clientWidth
			)
			if (windowWidth > 400) {
				return 300
			}
			return windowWidth - 100
		}

		const boneFields = () => {
			return (
				<div>
					<Row className="show-grid luunTiedot">
						<Col xs={12} md={4}>
							{this.textField('nameLatin', 'Latinankielinen nimi', this.state.nameLatin, this.handleChange)}
						</Col>
						<Col xs={12} md={4}>
							{this.textField('altNameLatin', 'Vaihtoehtoinen latinankielinen nimi', this.state.altNameLatin, this.handleChange)}
						</Col>
						<Col xs={12} md={4}>
							{this.textField('name', 'Suomenkielinen nimi', this.state.name, this.handleChange)}
						</Col>
					</Row>
					<Row className="show-grid">
						<Col xs={12} md={4}>
							<FormGroup controlId="bodyPart">
								<ControlLabel>Valitse ruumiinosa</ControlLabel>
								<FormControl
									componentClass="select"
									placeholder="select"
									id="bodyPart"
									name="bodyPart"
									value={this.state.bodyPart}
									onChange={this.handleChange}
								>
									{this.props.init.bodyParts.map(b => {
										return (
											<option key={b.id} value={b.id}>{b.name}</option>
										)
									})}
								</FormControl>
							</FormGroup>
						</Col>
						<Col xs={12} md={8}>
							{this.textField('description', 'Vapaamuotoinen kuvaus', this.state.description, this.handleChange)}
						</Col>
					</Row>
				</div>
			)
		}

		const saveButtons = () => {
			if (this.props.boneId) {
				return (
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
				)
			} else {
				return (
					<div id="addBone" className="btn-toolbar">
						<button
							type="submit"
							id="submitNewBoneButton"
							className="btn btn-info pull-right">
							Lisää luu
						</button>
					</div>
				)
			}
		}

		const imageFields = (i, handler, value) => {
			return (
				<div>
					<Row className="show-grid">
						<Col xs={12} md={4}>
							<FormGroup controlId="animal">
								<ControlLabel>Eläin</ControlLabel>
								<FormControl
									componentClass="select"
									placeholder="valitse"
									id="animal"
									name="animal"
									value={value.animal}
									onChange={handler.bind(this, i)}
								>
									{
										this.props.init.animals.map((animal, i) =>
											<option key={animal.id} value={animal.id}>
												{animal.name}
											</option>)
									}
								</FormControl>
							</FormGroup>
						</Col>
						<Col xs={12} md={4}>
							<FormGroup controlId="handedness">
								<ControlLabel>Puoli</ControlLabel>
								<FormControl
									componentClass="select"
									placeholder="valitse"
									id="handedness"
									name="handedness"
									value={value.handedness}
									onChange={handler.bind(this, i)}
								>
									<option value="">Ei valintaa</option>
									<option value="dex">dex</option>
									<option value="sin">sin</option>
								</FormControl>
							</FormGroup>
						</Col>
						<Col xs={12} md={4}>
							<FormGroup controlId="difficulty">
								<ControlLabel>Vaikeustaso</ControlLabel>
								<FormControl
									componentClass="select"
									placeholder="valitse"
									id="difficulty"
									name="difficulty"
									value={value.difficulty}
									onChange={handler.bind(this, i)}
								>
									<option value={1}>Helppo</option>
									<option value={100}>Vaikea</option>
								</FormControl>
							</FormGroup>
						</Col>
					</Row>
					<Row className="show-grid">
						<Col xs={12} md={6}>
							{this.textField('photographer', 'Valokuvaaja', value.photographer, handler.bind(this, i))}
						</Col>
						<Col xs={12} md={6}>
							{this.textField('copyright', 'Tekijänoikeus', value.copyright, handler.bind(this, i))}
						</Col>
					</Row>
					<Row>
						<Col xs={12} md={12}>
							{this.textField('description', 'Vapaamuotoinen kuvaus', value.description, handler.bind(this, i))}
						</Col>
					</Row>
				</div>
			)
		}

		return (
			<div className="menu-background">
				<Grid>
					<div className="App">
						<Row className="show-grid">
							<Col xs={12} md={8}>
								<Message />
							</Col>
							<Col xs={12} md={4}>
								<Link to='/listing'>
									<button id="backToListing" className="btn btn-default pull-right">
										Takaisin listaukseen
									</button>
								</Link>
							</Col>
						</Row>
						<Row className="show-grid">
							<Col xs={12} md={12} className="pull-left">
								<h2 className="titleStyle"><Label className="labelStyle">Luun tiedot</Label></h2>
							</Col>
						</Row>
						<form onSubmit={this.handleSubmit} enctype="multipart/form-data">
							{boneFields()}
							<Row className="show-grid">
								<Col xs={12} md={12} className="pull-left">
									<h2 className="titleStyle"><Label className="labelStyle">Kuvat</Label></h2>
								</Col>
							</Row>
							{this.state.images.map((file, i) => <li key={file.id} id={"bone" + i} className="list-group-item clearfix listStyle">
								{(this.state.images[i].deleted
									? " (Poistetaan tallennuksen yhteydessä)" :
									<Row className="show-grid">
										<Col md={4} xs={12} className="imgStyle">
											<CloudinaryContext cloudName="luupeli">
												<Image publicId={file.url}>
													<Transformation width={imageWidth()} crop="fill" />
												</Image>
											</CloudinaryContext>
										</Col>
										<Col md={8} xs={12}>
											{imageFields(i, this.handleImageChange, this.state.images[i])}
										</Col>
									</Row>
								)
								}
								<Row className="show-grid">
									<Col xs={12} md={12}>
										<button
											id={"deleteImageButton" + i}
											type="button" className="btn btn-danger pull-right"
											onClick={this.markForDelete.bind(this, i)}
										>
											{(this.state.images[i].deleted ? "Peruuta poisto" : "Poista")}
										</button>
									</Col>
								</Row>
							</li>
							)}
							<Row className="show-grid">
								<Col xs={12} md={12} className="pull-left">
									<h2 className="titleStyle"><Label className="labelStyle">Uudet kuvat</Label></h2>
								</Col>
							</Row>
							<ul className="list-group">
								{
									this.state.newImages.map((file, i) =>
										<li key={file.id}
											className="list-group-item clearfix listStyle">
											<Row className="show-grid">
												<Col md={4} xs={12}>
													<img id="new_image" alt="bone" width={imageWidth()} />
													<center>
														<input
															type="file"
															accept="image/x-png,image/jpeg"
															id="boneImage"
															onChange={input => this.previewImage(input)}
															ref={input => { this[`fileInput${i}`] = input }} />
													</center>
												</Col>
												<Col md={8} xs={12}>
													{imageFields(i, this.handleNewImageChange, this.state.newImages[i])}
												</Col>
											</Row>
										</li>
									)}
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
							{saveButtons()}
						</form>
					</div>
				</Grid>
			</div>
		)
	}
}

const mapDispatchToProps = {
	setMessage
}

const mapStateToProps = (state) => {
	return {
		init: state.init
	}
}

const ConnectedUpdateBone = connect(
	mapStateToProps,
	mapDispatchToProps
)(UpdateBone)
export default ConnectedUpdateBone
