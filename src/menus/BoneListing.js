import React from 'react'
import boneService from '../services/bones'
import animalService from '../services/animals'
import bodyPartService from '../services/bodyParts'
import { Link } from 'react-router-dom'
import { ToggleButtonGroup, ToggleButton, Row, Col, Grid, FormControl } from 'react-bootstrap'

class BoneListing extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			bones: [],
			animals: [],
			selectedAnimals: [],
			bodyParts: [],
			selectedBodyParts: [],
			search: '',
			user: null
		}

		this.handleAnimalChange = this.handleAnimalChange.bind(this)
		this.handleBodyPartChange = this.handleBodyPartChange.bind(this)
		this.handleChange = this.handleChange.bind(this)

		window.onunload = function () { window.location.href = '/' }
	}

	//GET list of bones from database and stuff it into this.state.bones for rendering
	componentDidMount() {
		boneService.getAll()
			.then((response) => {
				this.setState({ bones: response.data })
			})
			.catch((error) => {
				console.log(error)
			})

		animalService.getAll()
			.then((response) => {
				this.setState({ animals: response.data })
			})
			.catch((error) => {
				console.log(error)
			})

		bodyPartService.getAll()
			.then((response) => {
				this.setState({ bodyParts: response.data })
			})
			.catch((error) => {
				console.log(error)
			})

		const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			this.setState({ user })
		}
	}

	handleAnimalChange(event) {
		let animals = this.state.selectedAnimals
		if (animals.includes(event.target.id)) {
			animals = animals.filter(a => a !== event.target.id)
		} else {
			animals.push(event.target.id)
		}
		this.setState({ selectedAnimals: animals })
	}

	handleBodyPartChange(event) {
		let bodyParts = this.state.selectedBodyParts
		if (bodyParts.includes(event.target.id)) {
			bodyParts = bodyParts.filter(a => a !== event.target.id)
		} else {
			bodyParts.push(event.target.id)
		}
		this.setState({ selectedBodyParts: bodyParts })
	}

	handleChange(e) {
		this.setState({ search: e.target.value })
	}

	//Filter and render bone listing by .mapping bones from this.state.bones array to Link elements.
	render() {
		let bonesToShow = this.state.bones

		// Filter by body parts 
		if (this.state.selectedBodyParts.length > 0) {
			bonesToShow = bonesToShow.filter(bone => this.state.selectedBodyParts.includes(bone.bodyPart._id))
		}

		// Filter by animals
		if (this.state.selectedAnimals.length > 0) {
			bonesToShow = bonesToShow.filter(bone => bone.images.some(img => this.state.selectedAnimals.includes(img.animal)))
		}

		// Filter by search attribute (latin names and finnish name)
		if (this.state.search.length > 0) {
			bonesToShow = bonesToShow.filter(bone => {
				return bone.nameLatin.toLowerCase().includes(this.state.search.toLowerCase()) || bone.altNameLatin.toLowerCase().includes(this.state.search.toLowerCase()) || bone.name.toLowerCase().includes(this.state.search.toLowerCase())
			})
		}

		const activeStyle = {
			background: '#b35900',
			color: 'white'
		}

		const searchStyle = {
			marginTop: 30,
			marginBottom: 15
		}

		console.log(bonesToShow)

		return (
			<div className="menu-background">
				<div className="App">
					<Link to='/admin'>
						<button className="gobackbutton">Takaisin</button>
					</Link>
					<div>
						<Grid>
							<div id="listGroup" className="list-group">
								<span className="list-group-item list-group-item-info clearfix">
									<Row className="show-grid">
										<Col xs={12} md={6}>
											<Row className="show-grid">
												<Col>
													<h5>Suodata lajin mukaan</h5>
												</Col>
											</Row>
											<Row className="show-grid">
												<Col>
													<ToggleButtonGroup
														id="animals"
														type="checkbox"
														defaultValue={this.state.selectedAnimals}
														onClick={this.handleAnimalChange}
													>
														{this.state.animals.map(animal => {
															if (!this.state.selectedAnimals.includes(animal.id)) {
																return <ToggleButton bsStyle="warning" id={animal.id} value={animal.id}>{animal.name} </ToggleButton>
															} else {
																return <ToggleButton style={activeStyle} id={animal.id} value={animal.id}>{animal.name} </ToggleButton>
															}
														}
														)}
													</ToggleButtonGroup>
												</Col>
											</Row>
											<Row className="show-grid">
												<Col>
													<h5>Suodata ruumiinosan mukaan</h5>
												</Col>
											</Row>
											<Row className="show-grid">
												<Col>
													<ToggleButtonGroup
														id="bodyparts"
														type="checkbox"
														defaultValue={this.state.selectedBodyParts}
														onClick={this.handleBodyPartChange}
													>
														{this.state.bodyParts.map(bodyPart => {
															if (!this.state.selectedBodyParts.includes(bodyPart.id)) {
																return <ToggleButton bsStyle="warning" id={bodyPart.id} value={bodyPart.id}>{bodyPart.name} </ToggleButton>
															} else {
																return <ToggleButton style={activeStyle} id={bodyPart.id} value={bodyPart.id}>{bodyPart.name} </ToggleButton>
															}
														}
														)}
													</ToggleButtonGroup>
												</Col>
											</Row>
										</Col>
										<Col xs={12} md={6}>
											<Row className="show-grid">
												<Col xs={12} md={10} style={searchStyle}>
													<form>
														<FormControl
															type="text"
															value={this.state.search}
															placeholder="Hae latinan- tai suomenkielisen nimen perusteella"
															onChange={this.handleChange}
														/>
													</form>
												</Col>
											</Row>
										</Col>
									</Row>

									<Link to='/add'><button id="addNewBoneButton" className="btn btn-info pull-right">Lisää uusi</button></Link></span>
								<div id="bones">
									{bonesToShow.map((bone, i) =>
										<Link key={bone.id} to={{
											pathname: '/update/' + bone.id,
											state: {
												id: bone.id,
												boneId: bone.id,
												nameLatin: bone.nameLatin,
												altNameLatin: bone.altNameLatin,
												description: bone.description,
												name: bone.name,
												bodyPart: bone.bodyPart.name,
												attempts: bone.attempts,
												correctAttempts: bone.correctAttempts,
												boneAnimals: bone.animals
											}
										}}>
											<button type="button" type="button" id={"bone" + i} className="list-group-item list-group-item-action">{bone.nameLatin} ({bone.animal})</button>
										</Link>)}
								</div>
							</div>
						</Grid>
					</div>
				</div>
			</div>
		)
	}
}

export default BoneListing
