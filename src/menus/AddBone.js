import React from 'react'
import { Link } from 'react-router-dom'

//Creates a text input with label text and feedback symbol
const TextInputWithFeedback = (props) => {
	return(
		<div class="form-group has-feedback">
			<label>{props.label}</label>
			<input type="text" id={props.id} class="form-control"/><span class="glyphicon glyphicon-asterisk form-control-feedback"></span>
		</div>
	)
}

//Creates a text input with label text and no feedback symbol
const TextInputWithoutFeedback = (props) => {
	return(
		<div class="form-group">
			<label>{props.label}</label>
			<input type="text" id={props.id} class="form-control"/>
		</div>
	)
}

//Creates a dropdown menu with label text and options mapped from a list of lists containing option value attribute and the text between option tags
const DropdownInput = (props) => {
	return(
		<div class="form-group">
			<label>{props.label}</label>
			<select id={props.id} class="form-control">
			{props.values.map(value => <option key={value.id} value={value[0]}>{value[1]}</option>)}
			</select>
		</div>
	)
}


const ImageInput = (props) => {
	return(
		<div class="form-group">
			<label>Kuva</label>
				<input type="file" accept="image/x-png,image/jpeg,image/gif" id={props.id} multiple="multiple"/>
				<span class="help-block">Voit valita useamman kuvan painamalla Ctrl-näppäintä ja klikkaamalla haluamiasi kuvia.</span>
				<label>Kuvan vaikeustaso</label>
			<input type="submit" value="Tallenna" class="btn btn-info" />
		</div>
	)
}

class AddBone extends React.Component {
	
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
				<TextInputWithFeedback label="Virallinen nimi" id="nameLatin"/>
				<TextInputWithoutFeedback label="Suomenkielinen nimi" id="name"/>
				<DropdownInput label="Eläin" id="animal" values={[['ca', 'Koira'], ['fe', 'Kissa'], ['eq', 'Hevonen'], ['bo', 'Nauta']]}/>
				<DropdownInput label="Ruumiinosa" id="bodypart" values={[['frontleg', 'Eturaaja'], ['backleg', 'Takaraaja'], ['body', 'Vartalo'], ['head', 'Pää']]}/>

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
				<input type="submit" value="Tallenna" class="btn btn-info pull-right" />
			</form>
		</div>
	)
}
}

export default AddBone
