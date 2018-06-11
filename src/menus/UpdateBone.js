import React from 'react'
import { Link } from 'react-router-dom'

class UpdateBone extends React.Component {
	
		constructor(props) {
		super(props);

		this.state = {
			nameLatin: this.props.location.state.nameLatin,
			name: this.props.location.state.name,
			animal: this.props.location.state.animal,
			bodypart: this.props.location.state.bodypart,
			files: [
			{
				filename: "",
				difficulty: "hard"
			},
			{
				filename: "",
				difficulty: "easy"
			}
			]
		};
		
		this.handleChange = this.handleChange.bind(this)
		this.handleAddImage = this.handleAddImage.bind(this)
		this.handleRemoveImage = this.handleRemoveImage.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}
	
	//Adds a new empty file to list of files when user clicks a button to add more images.
	//File list is used to dynamically render correct amount of file input elements in the update form
	handleAddImage(event) {
		const expandList = this.state.files.concat({filename: "", difficulty: "easy"})
		this.setState({ files: expandList})
	}
	
	/*TODO button to remove a file input field from form. Also remove the image selected in said input field, if it exists.
	handleRemoveImage(i) {
		this.setState({ files: this.state.files.filter((s, sidx) => i !== sidx) })
	}
	*/
	
	//When user changes the value of a field in the form, reflect that change in state.
	//[event.target.name] must corresponds both to a form field name and a state variable name.
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value })
	}
	
	handleSubmit(event) {
		//TODO
	}
	
	//When user changes image difficulty in form, reflect that change in state.
	//i: image index in list of files
	handleFileChange(i, event) {
		const modifiedList = this.state.files
		modifiedList[i].difficulty = event.target.value
		this.setState({ files: modifiedList })
	}
	
	render() {
		return (
		<div className="App">
		<Link to='/listing'><button className="btn btn-default pull-right">Takaisin listaukseen</button></Link><br/>
			<form method="POST" action="/submit" onSubmit={this.handleSubmit}>
			
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
				
				<label className="pull-left">Kuvat</label>
				<ul className="list-group">
				{this.state.files.map((file, i) => <li key={file.id} className="list-group-item clearfix">
				<input type="file" accept="image/x-png,image/jpeg" id="boneImage" ref={input => {this.fileInput = input}}/>
				<select name="difficulty" className="form-control" value={this.state.files[i].difficulty} onChange={this.handleFileChange.bind(this, i)}>
					<option value="easy">Helppo</option>
					<option value="hard">Vaikea</option>
				</select>
				<button type="button" className="btn btn-danger pull-right">Poista</button>
				</li>)}
				<li className="list-group-item clearfix"><button type="button" className="btn btn-default pull-right" onClick={this.handleAddImage}>Lisää uusi kuva</button></li>
				</ul>
				
				<div className="btn-toolbar">
					<input type="submit" name="save" value="Tallenna muutokset" className="btn btn-info pull-right" />
					<input type="submit" name="delete" value="Poista luu" className="btn btn-danger pull-right" />
				</div>
			</form>
		</div>
	)
}
}

export default UpdateBone
