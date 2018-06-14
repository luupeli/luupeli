import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import WGMessage from '../games/writinggame/WGMessage'

class UpdateBone extends React.Component {
	
		constructor(props) {
		super(props);

		this.state = {
			submitted: false,
			boneId: this.props.location.state.boneId,
			nameLatin: this.props.location.state.nameLatin,
			name: this.props.location.state.name,
			animal: this.props.location.state.animal,
			bodypart: this.props.location.state.bodypart,
			images: [
			{
				url: "",
				difficulty: "100"
			},
			{
				url: "",
				difficulty: "1"
			}
			],
			newImages: [
			{
				url: "",
				difficulty: "100"
			}],
			animals: [],
			bodyparts: []
		};
		
		this.handleChange = this.handleChange.bind(this)
		this.handleAddImage = this.handleAddImage.bind(this)
		//this.handleRemoveImage = this.handleRemoveImage.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleDelete = this.handleDelete.bind(this)
	}
	
	//GET images related to this bone from DB.
	//GET animals and bodyparts.
	componentDidMount() {
		const url = 'http://luupeli-backend.herokuapp.com/api/bones/' + this.state.boneId
		/*axios.get(url)
		.then((response) => {
			this.setState({ nameLatin: response.data.nameLatin,
				name: response.data.name,
				animal: response.data.animal.name,
				bodypart: response.data.bodypart.name
		})
		})
		.catch((error) => {
			console.log(error)
		})*/
		
		axios.get(url)
			.then((response) => {
				console.log(response)
				var boneImages = []
				for(var i = 0; i < response.data.images.length; i++) {
					boneImages = boneImages.concat({
						url: response.data.images[i].url,
						difficulty: response.data.images[i].difficulty
					})
				}
				this.setState({ images: boneImages })
			})
			.catch((error) => {
				console.log(error)
			})
			
		axios.get('http://luupeli-backend.herokuapp.com/api/animals/')
			.then((response) => {
				var animals = response.data
				this.setState({ animals: animals })
			})
			.catch((error) => {
				console.log(error)
			})
			
		axios.get('http://luupeli-backend.herokuapp.com/api/bodyparts/')
			.then((response) => {
				var bodyparts = response.data
				this.setState({ bodyparts: bodyparts })
			})
			.catch((error) => {
				console.log(error)
			})
	}
	
	//Adds a new empty file to list of images when user clicks a button to add more images.
	//File list is used to dynamically render correct amount of file input elements in the update form
	handleAddImage(event) {
		const expandList = this.state.images.concat({url: "", difficulty: 1})
		this.setState({ images: expandList})
	}
	
	/*TODO button to remove a file input field from form. Also remove the image selected in said input field, if it exists.
	handleRemoveImage(i) {
		this.setState({ images: this.state.images.filter((s, sidx) => i !== sidx) })
	}
	*/
	
	//When user changes the value of a field in the form, reflect that change in state.
	//event.target.name must correspond both to a input field name and a state variable name.
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value })
	}
	
	//Send updated values from this.state to DB.
	//Set this.state.submitted to true in preparation for redirect to listing.
	handleSubmit(event) {
		event.preventDefault()
		const url = "http://luupeli-backend.herokuapp.com/api/bones/" + this.state.boneId
		const animalObj = this.state.animals.filter((animal) => animal.name === this.state.animal)
		console.log(animalObj)
		const bodypartObj = this.state.bodyparts.filter((bodypart) => bodypart.name === this.state.bodypart)
		console.log(bodypartObj)
		axios.put(url, {
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
		this.wgmessage.setMessage('Muutokset tallennettu!')
		this.wgmessage.setStyle("alert alert-success")
	}
	
	//Delete this bone from DB.
	//Set this.state.submitted to true in preparation for redirect to listing.
	handleDelete(event) {
		const url = "http://luupeli-backend.herokuapp.com/api/bones/" + this.state.boneId
		console.log(url)
		axios.delete(url, {id: this.state.boneId})
		.then((response) => {
			console.log(response)
		})
		.catch((error) => {
			console.log(error)
		})
	}
	
	//When user changes image difficulty in form, reflect that change in state.
	//i: list index of the image where difficulty was changed
	handleFileChange(i, event) {
		const modifiedList = this.state.images
		modifiedList[i].difficulty = event.target.value
		this.setState({ images: modifiedList })
	}
	
	//When user changes newImage difficulty in form, reflect that change in state.
	//i: list index of the newImage where difficulty was changed
	handleNewFileChange(i, event) {
		const modifiedList = this.state.newImages
		modifiedList[i].difficulty = event.target.value
		this.setState({ newImages: modifiedList })
	}
	
	
	//If this.state.submitted is true (i.e. bone data has been updated or deleted), redirect to listing.
	//Otherwise render bone update form.
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
				{this.state.images.map((file, i) => <li key={file.id} className="list-group-item clearfix">
				{file.url}
				<select name="difficulty" className="form-control" value={this.state.images[i].difficulty} onChange={this.handleFileChange.bind(this, i)}>
					<option value={1}>Helppo</option>
					<option value={100}>Vaikea</option>
				</select>
				<button type="button" className="btn btn-danger pull-right">Poista</button>
				</li>)}
				</ul>
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
					<button type="submit" className="btn btn-info pull-right">Tallenna muutokset</button>
					<button type="button" onClick={this.handleDelete} className="btn btn-danger pull-right">Poista luu</button>
				</div>
			</form>
		</div>
	)

}
}

export default UpdateBone
