import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import WGMessage from '../games/writinggame/WGMessage'

//Creates a text input with label text and feedback symbol
const TextInputWithFeedback = (props) => {
	return(
		<div className="form-group has-feedback">
			<label className="pull-left">{props.label}</label>
			<input type="text" id={props.id} className="form-control"/><span className="glyphicon glyphicon-asterisk form-control-feedback"></span>
		</div>
	)
}

//Creates a text input with label text and no feedback symbol
const TextInputWithoutFeedback = (props) => {
	return(
		<div className="form-group">
			<label className="pull-left">{props.label}</label>
			<input type="text" id={props.id} className="form-control"/>
		</div>
	)
}

//Creates a dropdown menu with label text and options mapped from a list of lists containing option value attribute and the text between option tags
const DropdownInput = (props) => {
	return(
		<div className="form-group">
			<label className="pull-left">{props.label}</label>
			<select id={props.id} className="form-control">
			{props.values.map(value => <option key={value.id} value={value[0]}>{value[1]}</option>)}
			</select>
		</div>
	)
}


const ImageInput = (props) => {
	return(
		<div className="form-group">
			<label className="pull-left">Kuva</label>
				<input type="file" accept="image/x-png,image/jpeg,image/gif" id={props.id} multiple="multiple"/>
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
			animal: "koira",
			bodypart: "eturaaja",
			newImages: [
			{
				filename: "",
				difficulty: 1
				}
			],
			animals: [],
			bodyparts: []
		};

		this.handleClick = this.handleClick.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleNewFileChange = this.handleNewFileChange.bind(this)
		this.resetFields = this.resetFields.bind(this)
		this.validateNameLatin = this.validateNameLatin.bind(this)
	}
	
	//GET animals and bodyparts
	componentDidMount() {
		axios.get('http://luupeli-backend.herokuapp.com/api/animals/')
			.then((response) => {
				var animals = response.data
				console.log(response.data)
				this.setState({ animals: animals })
			})
			.catch((error) => {
				console.log(error)
			})
			
		axios.get('http://luupeli-backend.herokuapp.com/api/bodyparts/')
			.then((response) => {
				var bodyparts = response.data
				console.log(response.data)
				this.setState({ bodyparts: bodyparts })
			})
			.catch((error) => {
				console.log(error)
			})
	}
	
	handleClick(event) {
		const expandList = this.state.files.concat({filename: "", difficulty: 1})
		this.setState({ files: expandList})
	}
	
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value })
	}
	
	handleNewFileChange(i, event) {
		const modifiedList = this.state.newImages
		modifiedList[i].difficulty = event.target.value
		this.setState({ newImages: modifiedList })
	}
	
	handleSubmit(event) {
		event.preventDefault()
		
		if (!this.validateNameLatin()) {
			return
		}
		
		const url = "http://luupeli-backend.herokuapp.com/api/bones/"
		const animalObj = this.state.animals.filter((animal) => animal.name === this.state.animal)
		console.log(this.state.animal)
		console.log(animalObj)
		const bodypartObj = this.state.bodyparts.filter((bodypart) => bodypart.name === this.state.bodypart)
		console.log(bodypartObj)
		axios.post(url, {
			nameLatin: this.state.nameLatin,
			name: this.state.name,
			animal: animalObj[0].id,
			bodypart: bodypartObj[0].id
		})
		.then((response) => {
			console.log(response)
		})
		.catch((error) => {
			console.log(error)
		})
		this.wgmessage.mountTimer()
		this.wgmessage.setMessage('Uusi luu lisätty! Voit nyt lisätä toisenkin luun tai palata nappulasta takaisin listausnäkymään.')
		this.wgmessage.setStyle("alert alert-success")
		this.resetFields()
	}
	
	validateNameLatin() {
		if (this.state.nameLatin.length >= 1) {
			return true
		}
		this.wgmessage.mountTimer()
		this.wgmessage.setMessage('Anna latinankielinen nimi.')
		this.wgmessage.setStyle("alert alert-danger")
		return false
	}
	
	resetFields() {
		this.setState({ nameLatin: "",
			name: "",
			animal: "koira",
			bodypart: "eturaaja",
			newImages: [
			{
				filename: "",
				difficulty: 1
				}
			]
			})
	}
	
	render() {
		if (this.state.submitted) {
			return (
				<Redirect to="/listing" />
			)
		}
		
		return (
			<div className="App">
			<div>
				<WGMessage ref={instance => this.wgmessage = instance} />
			</div>
			<Link to='/listing'><button className="btn btn-default pull-right">Takaisin listaukseen</button></Link><br/>
				<form onSubmit={this.handleSubmit}>
			
					<div className="form-group has-feedback">
						<label className="pull-left">Virallinen nimi </label>
						<input type="text" name="nameLatin" value={this.state.nameLatin} className="form-control" onChange={this.handleChange} /><span className="glyphicon glyphicon-asterisk form-control-feedback"></span>
					</div>
				
					<label className="pull-left">Suomenkielinen nimi</label>
					<input type="text" name="name" value={this.state.name} className="form-control" onChange={this.handleChange}/>
				
					<label className="pull-left">Eläin</label>
					<select name="animal" className="form-control" value={this.state.animal} onChange={this.handleChange}>
						<option value="koira">Koira</option>
						<option value="kissa">Kissa</option>
						<option value="hevonen">Hevonen</option>
						<option value="nauta">Nauta</option>
					</select>
				
					<label className="pull-left">Ruumiinosa</label>
					<select name="bodypart" className="form-control" value={this.state.bodypart} onChange={this.handleChange}>
						<option value="eturaaja">Eturaaja</option>
						<option value="takaraaja">Takaraaja</option>
						<option value="keho">Vartalo</option>
						<option value="pää">Pää</option>
					</select>
				
					<ul className="list-group">
						{this.state.newImages.map((file, i) => <li key={file.id} className="list-group-item clearfix">
						<input type="file" accept="image/x-png,image/jpeg" id="boneImage" ref={input => {this.fileInput = input}}/>
						<select name="difficulty" className="form-control" value={this.state.newImages[i].difficulty} onChange={this.handleNewFileChange.bind(this, i)}>
							<option value={1}>Helppo</option>
							<option value={100}>Vaikea</option>
						</select>
						<button type="button" className="btn btn-danger pull-right">Poista</button>
						</li>)}
						<li className="list-group-item clearfix"><button type="button" className="btn btn-default pull-right" onClick={this.handleAddImage}>Lisää uusi kuva</button></li>
					</ul>
				
					<div className="btn-toolbar">
						<button type="submit" className="btn btn-info pull-right">Lisää luu</button>
					</div>
				</form>
			</div>
		)
}
}

export default AddBone
