import React from 'react'
import { Link } from 'react-router-dom'

class UpdateBone extends React.Component {
	
		constructor(props) {
		super(props);

		this.state = {
			files: [
			{
				filename: "",
				difficulty: "easy"
				}
			]
		};

		this.handleClick = this.handleClick.bind(this)
	}
	
	handleClick(event) {
		const expandList = this.state.files.concat({filename: "", difficulty: "easy"})
		this.setState({ files: expandList})
	}
	
	render() {
		return (
		<div classname="App">
		<Link to='/listing'><button className="btn btn-default pull-right">Takaisin listaukseen</button></Link><br/>
			<form method="POST" action="/submit">
			
				<div class="form-group has-feedback">
					<label>Virallinen nimi </label>
					<input type="text" id="nameLatin" value={this.props.location.state.nameLatin} class="form-control"/><span class="glyphicon glyphicon-asterisk form-control-feedback"></span>
				</div>
				
				<label>Suomenkielinen nimi</label>
				<input type="text" id="name" value={this.props.location.state.name} class="form-control"/>
				
				<label>Eläin</label>
				<select id="animal" class="form-control">
					{this.props.location.state.animal === "ca" ? <option value="ca" selected="selected">Koira</option> : <option value="ca">Koira</option>}
					{this.props.location.state.animal === "fe" ? <option value="fe" selected="selected">Kissa</option> : <option value="fe">Kissa</option>}
					{this.props.location.state.animal === "eq" ? <option value="eq" selected="selected">Hevonen</option> : <option value="eq">Hevonen</option>}
					{this.props.location.state.animal === "bo" ? <option value="bo" selected="selected">Nauta</option> : <option value="bo">Nauta</option>}
				</select>
				
				<label>Ruumiinosa</label>
				<select id="bodyPart" class="form-control">
					{this.props.location.state.bodypart === "frontleg" ? <option value="frontleg" selected="selected">Eturaaja</option> : <option value="frontleg">Eturaaja</option>}
					{this.props.location.state.bodypart === "backleg" ? <option value="backleg" selected="selected">Takaraaja</option> : <option value="backleg">Takaraaja</option>}
					{this.props.location.state.bodypart === "body" ? <option value="body" selected="selected">Vartalo</option> : <option value="body">Vartalo</option>}
					{this.props.location.state.bodypart === "head" ? <option value="head" selected="selected">Pää</option> : <option value="head">Pää</option>}
				</select>
				
				<label>Kuvat</label>
				<ul class="list-group">
				{this.state.files.map(file => <li key={file.id} class="list-group-item clearfix">
				<input type="file" accept="image/x-png,image/jpeg" id="boneImage"/>
				<select id="difficulty" class="form-control">
				{file.difficulty === "easy" ? 
					<option value="easy" selected="selected">Helppo</option> : 
					<option value="easy">Helppo</option>
				}
				{file.difficulty === "hard" ?
					<option value="hard" selected="selected">Vaikea</option> :
					<option value="hard">Vaikea</option>
				}
				</select>
				</li>)}
				<li class="list-group-item clearfix"><button type="button" class="btn btn-default pull-right" onClick={this.handleClick}>Lisää uusi kuva</button></li>
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
