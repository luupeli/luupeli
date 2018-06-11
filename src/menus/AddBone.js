import React from 'react'
import { Link } from 'react-router-dom'

//Creates a text input with label text and feedback symbol
const TextInputWithFeedback = (props) => {
	return(
		<div className="form-group has-feedback">
			<label>{props.label}</label>
			<input type="text" id={props.id} className="form-control"/><span className="glyphicon glyphicon-asterisk form-control-feedback"></span>
		</div>
	)
}

//Creates a text input with label text and no feedback symbol
const TextInputWithoutFeedback = (props) => {
	return(
		<div className="form-group">
			<label>{props.label}</label>
			<input type="text" id={props.id} className="form-control"/>
		</div>
	)
}

//Creates a dropdown menu with label text and options mapped from a list of lists containing option value attribute and the text between option tags
const DropdownInput = (props) => {
	return(
		<div className="form-group">
			<label>{props.label}</label>
			<select id={props.id} className="form-control">
			{props.values.map(value => <option key={value.id} value={value[0]}>{value[1]}</option>)}
			</select>
		</div>
	)
}


const ImageInput = (props) => {
	return(
		<div className="form-group">
			<label>Kuva</label>
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
			nameLatin: "",
			name: "",
			animal: "",
			bodypart: "",
			files: [
			{
				filename: "",
				difficulty: "easy"
				}
			]
		};

		this.handleClick = this.handleClick.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}
	
	handleClick(event) {
		const expandList = this.state.files.concat({filename: "", difficulty: "easy"})
		this.setState({ files: expandList})
	}
	
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value })
	}
	
	render() {
		return (
		<div className="App">
		<Link to='/listing'><button className="btn btn-default pull-right">Takaisin listaukseen</button></Link><br/>
			<form method="POST" action="/submit">
				<TextInputWithFeedback label="Virallinen nimi" name="nameLatin"/>
				<TextInputWithoutFeedback label="Suomenkielinen nimi" name="name"/>
				<DropdownInput label="Eläin" name="animal" values={[['ca', 'Koira'], ['fe', 'Kissa'], ['eq', 'Hevonen'], ['bo', 'Nauta']]}/>
				<DropdownInput label="Ruumiinosa" name="bodypart" values={[['frontleg', 'Eturaaja'], ['backleg', 'Takaraaja'], ['body', 'Vartalo'], ['head', 'Pää']]}/>

				<label>Kuvat</label>
				<ul className="list-group">
				{this.state.files.map(file => <li key={file.id} className="list-group-item clearfix">
				<input type="file" accept="image/x-png,image/jpeg" id="boneImage"/>
				<select id="difficulty" className="form-control">
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
				<li className="list-group-item clearfix"><button type="button" className="btn btn-default pull-right" onClick={this.handleClick}>Lisää uusi kuva</button></li>
				</ul>
				<input type="submit" value="Tallenna" className="btn btn-info pull-right" />
			</form>
		</div>
	)
}
}

export default AddBone
