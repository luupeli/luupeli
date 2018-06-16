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
			newImages: [],
			images: [],
			animals: [],
			bodyparts: []
		};
		
		this.handleChange = this.handleChange.bind(this)
		this.handleAddImage = this.handleAddImage.bind(this)
		this.handleRemoveNewImage = this.handleRemoveNewImage.bind(this)
		this.handleRemoveImage = this.handleRemoveImage.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleDelete = this.handleDelete.bind(this)
		this.handleNewImageChange = this.handleNewImageChange.bind(this)
		this.handleImageChange = this.handleImageChange.bind(this)
		this.validateNameLatin = this.validateNameLatin.bind(this)
		this.validateImages = this.validateImages.bind(this)
	}
	
	//GET images related to this bone from DB and store them in state for rendering.
	//GET animals and bodyparts and store them in state for later use.
	componentDidMount() {
		const url = 'http://luupeli-backend.herokuapp.com/api/bones/' + this.state.boneId
		
		axios.get(url)
			.then((response) => {
				console.log(response)
				var boneImages = []
				for(var i = 0; i < response.data.images.length; i++) {
					boneImages = boneImages.concat({
						id: response.data.images[i].id,
						url: response.data.images[i].url,
						difficulty: response.data.images[i].difficulty
					})
				}
				this.setState({ images: response.data.images })
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
	
	//Adds a new "empty file" to newImages list when user clicks a button to add more images.
	//newImages is used to dynamically render correct amount of file & difficulty input elements in the update form
	handleAddImage(event) {
		const expandList = this.state.newImages.concat({url: "", difficulty: 1})
		this.setState({ newImages: expandList})
	}
	
	//Removes element at index i from this.state.newImages (and thus the corresponding file input element from the form)
	handleRemoveNewImage(i, event) {
		this.setState({ newImages: this.state.newImages.filter((element, index) => {return index !== i}) })
	}
	
	//Removes element at index i from this.state.images and deletes it from the database.
	handleRemoveImage(i, event) {
		const url = 'http://luupeli-backend.herokuapp.com/api/images/' + this.state.images[i].id
		axios.delete(url)
		.then((response) => {
			console.log(response)
		})
		.catch((error) => {
			console.log(error)
		})
		this.setState({ images: this.state.images.filter((element, index) => {return index !== i}) })
	}
	
	//When user changes the value of a field in the form, reflect that change in state.
	//event.target.name must correspond both to a input field name and a state variable name.
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value })
	}
	
	//Sends bone-related values from this.state to the database.
	//Updates difficulties for all images already in the database.
	//TODO: Posts new images to the database.
	//Prepare a WGMessage to notify user of a failed or successful save.
	handleSubmit(event) {
		event.preventDefault()
		
		if (!this.validateNameLatin() || !this.validateImages()) {
			return
		}
		
		const url = "http://luupeli-backend.herokuapp.com/api/bones/" + this.state.boneId
		var errored = false
		
		const animalObj = this.state.animals.filter((animal) => animal.name === this.state.animal)
		const bodypartObj = this.state.bodyparts.filter((bodypart) => bodypart.name === this.state.bodypart)
		
		for (var i = 0; i < this.state.images.length; i++) {
			axios.put("http://luupeli-backend.herokuapp.com/api/images/" + this.state.images[i]._id, {
				difficulty: this.state.images[i].difficulty
			})
			.then((response) => {
				console.log(response)
			})
			.catch((error) => {
				console.log(error)
			})
		}
		
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
			errored = true
			this.wgmessage.mountTimer()
			this.wgmessage.setMessage('Tallentaminen epäonnistui :(')
			this.wgmessage.setStyle("alert alert-danger")
		})
		
		if (!errored) {
			this.wgmessage.mountTimer()
			this.wgmessage.setMessage('Muutokset tallennettu!')
			this.wgmessage.setStyle("alert alert-success")
		}
	}
	
	//Delete this bone from DB.
	//Set this.state.submitted to true in preparation for redirect to listing.
	//Prepare a message to notify user of the success/failure of the delete.
	handleDelete(event) {
		const url = "http://luupeli-backend.herokuapp.com/api/bones/" + this.state.boneId
		var errored = false
		console.log(url)
		axios.delete(url, {id: this.state.boneId})
		.then((response) => {
			console.log(response)
		})
		.catch((error) => {
			console.log(error)
			errored = true
			this.wgmessage.mountTimer()
			this.wgmessage.setMessage('Poisto epäonnistui :(')
			this.wgmessage.setStyle("alert alert-danger")
		})
		
		if(!errored) {
			this.wgmessage.mountTimer()
			this.wgmessage.setMessage('Poistettu!')
			this.wgmessage.setStyle("alert alert-success")
		}
	}
	
	//When user changes image difficulty in form, reflect that change in state.
	//i: list index of the image where difficulty was changed
	//TODO: write a generalised function to consolidate this and handleNewFileChange()
	handleImageChange(i, event) {
		const modifiedList = this.state.images
		modifiedList[i].difficulty = event.target.value
		this.setState({ images: modifiedList })
	}
	
	//When user changes newImage difficulty in form, reflect that change in state.
	//i: list index of the newImage where difficulty was changed
	//TODO: write a generalised function to consolidate this and handleFileChange()
	handleNewImageChange(i, event) {
		const modifiedList = this.state.newImages
		modifiedList[i].difficulty = event.target.value
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
		<div className="App">
		<div>
			<WGMessage ref={instance => this.wgmessage = instance} />
		</div>
		<Link to='/listing'><button className="btn btn-default pull-right">Takaisin listaukseen</button></Link><br/>
			<form onSubmit={this.handleSubmit}>
			
				<div className="form-group has-feedback">
					<label className="pull-left">Latinankielinen nimi </label>
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
				
				<span className="clearfix"><label className="pull-left">Ladatut kuvat</label></span>
				<ul className="list-group">
				{this.state.images.map((file, i) => <li key={file.id} className="list-group-item clearfix">
				<span className="pull-left">{file.url}</span><br />
				<div className="input-group">
					<select name="difficulty" className="form-control" value={this.state.images[i].difficulty} onChange={this.handleImageChange.bind(this, i)}>
						<option value={1}>Helppo</option>
						<option value={100}>Vaikea</option>
					</select>
					<span className="input-group-btn">
						<button type="button" className="btn btn-danger pull-right">Poista</button>
					</span>
				</div>
				</li>)}
				</ul>
				
				<span className="clearfix"><label className="pull-left">Uudet kuvat</label></span>
				<ul className="list-group">
				{this.state.newImages.map((file, i) => <li key={file.id} className="list-group-item clearfix">
				<input type="file" accept="image/x-png,image/jpeg" id="boneImage" ref={input => {this.fileInput = input}}/>
				<div className="input-group">
					<select name="difficulty" className="form-control" value={this.state.newImages[i].difficulty} onChange={this.handleNewImageChange.bind(this, i)}>
						<option value="1">Helppo</option>
						<option value="100">Vaikea</option>
					</select>
					<span className="input-group-btn">
						<button type="button" className="btn btn-danger pull-right" onClick={this.handleRemoveNewImage.bind(this, i)}>Poista</button>
					</span>
				</div>
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
