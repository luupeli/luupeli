import React from 'react'
import boneService from '../services/bones'
import animalService from '../services/animals'
import bodyPartService from '../services/bodyParts'
import { Link, Redirect } from 'react-router-dom'
import { ToggleButtonGroup, ToggleButton, Row, Col, Grid, FormControl } from 'react-bootstrap'
import { connect } from 'react-redux'

class BoneListing extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			redirect: false,
			redirectTo: '',
			bones: [],
			selectedAnimals: [],
			selectedBodyParts: [],
			search: '',
			user: null
		}

		this.handleAnimalChange = this.handleAnimalChange.bind(this)
		this.handleBodyPartChange = this.handleBodyPartChange.bind(this)
		this.handleChange = this.handleChange.bind(this)

		window.onunload = function () { window.location.href = '/' }
	}

	// GET list of bones from database and stuff it into this.state.bones for rendering
	componentDidMount() {
		boneService.getAll()
			.then((response) => {
				console.log("bone response:")
				console.log(response)
				this.setState({ bones: response.data })
			})
			.catch((error) => {
				console.log(error)
			})

		const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			if (user.role !== "ADMIN") {
				this.setState({ redirect: true, redirectTo: '/login' })
			}
			this.setState({ user })
		} else {
			this.setState({ redirect: true, redirectTo: '/login' })
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

	// Filter and render bone listing by .mapping bones from this.state.bones array to Link elements.
	render() {
		// Redirects
		if (this.state.redirect) {
			return (
				<Redirect to={{
					pathname: this.state.redirectTo,
				}} />
			)
		}

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
														{this.props.init.animals.map(animal => {
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
														{this.props.init.bodyParts.map(bodyPart => {
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
											pathname: '/update/' + bone.id}}>
											<button type="button" id={"bone" + i} className="list-group-item list-group-item-action">{bone.nameLatin} ({bone.animal})</button>
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


const mapStateToProps = (state) => {
	return {
		init: state.init
	}
}

const ConnectedBoneListing = connect(
	mapStateToProps,
	null
)(BoneListing)
export default ConnectedBoneListing

