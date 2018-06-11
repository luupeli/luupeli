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
	}
	
	//Adds a new empty file to list of files when user clicks a button to add more images.
	//File list is used to dynamically render correct amount of file input elements in the update form
	handleAddImage(event) {
		const expandList = this.state.files.concat({filename: "", difficulty: "easy"})
		this.setState({ files: expandList})
	}
	
	handleRemoveImage(i) {
		this.setState({ files: this.state.files.filter((s, sidx) => i !== sidx) })
	}
	
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value })
	}
	
	handleFileChange(i, event) {
		const modifiedList = this.state.files
		modifiedList[i].difficulty = event.target.value
		this.setState({ files: modifiedList })
	}
	
	render() {
		return (
		<div classname="App">
		<Link to='/listing'><button className="btn btn-default pull-right">Takaisin listaukseen</button></Link><br/>
			<form method="POST" action="/submit">
			
				<div class="form-group has-feedback">
					<label>Virallinen nimi </label>
					<input type="text" name="nameLatin" value={this.state.nameLatin} class="form-control" onChange={this.handleChange} /><span class="glyphicon glyphicon-asterisk form-control-feedback"></span>
				</div>
				
				<label>Suomenkielinen nimi</label>
				<input type="text" name="name" value={this.state.name} class="form-control" onChange={this.handleChange}/>
				
				<label>Eläin</label>
				<select name="animal" class="form-control" value={this.state.animal} onChange={this.handleChange}>
					<option value="ca">Koira</option>
					<option value="fe">Kissa</option>
					<option value="eq">Hevonen</option>
					<option value="bo">Nauta</option>
				</select>
				
				<label>Ruumiinosa</label>
				<select name="bodypart" class="form-control" value={this.state.bodypart} onChange={this.handleChange}>
					<option value="frontleg">Eturaaja</option>
					<option value="backleg">Takaraaja</option>
					<option value="body">Vartalo</option>
					<option value="head">Pää</option>
				</select>
				
				<label>Kuvat</label>
				<ul class="list-group">
				{this.state.files.map((file, i) => <li key={file.id} class="list-group-item clearfix">
				<input type="file" accept="image/x-png,image/jpeg" id="boneImage"/>
				<select name="difficulty" class="form-control" value={this.state.files[i].difficulty} onChange={this.handleFileChange.bind(this, i)}>
					<option value="easy">Helppo</option>
					<option value="hard">Vaikea</option>
				</select>
				<button type="button" class="btn btn-danger">Poista</button>
				</li>)}
				<li class="list-group-item clearfix"><button type="button" class="btn btn-default pull-right" onClick={this.handleAddImage}>Lisää uusi kuva</button></li>
				</ul>
				
				<div class="btn-toolbar">
					<input type="submit" name="save" value="Tallenna muutokset" class="btn btn-info pull-right" />
					<input type="submit" name="delete" value="Poista luu" class="btn btn-danger pull-right" />
				</div>
			</form>
		</div>
	)
}
}

export default UpdateBone
