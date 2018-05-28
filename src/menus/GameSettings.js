import React from 'react'
import { Link } from 'react-router-dom'

const GameSettings = () => (
	<div>
	<div className="App settingspage">
      <h1 className="h2">Valitse eläin:</h1>
			<form>
        <label className="radio-inline"><input type="radio" name="1"></input>Koira</label>
        <label className="radio-inline"><input type="radio" name="1"></input>Kissa</label>
        <label className="radio-inline"><input type="radio" name="1"></input>Hevonen</label>
        <label className="radio-inline"><input type="radio" name="1"></input>Gorilla</label>
      </form>
			<h1 className="h2">Valitse ruumiinosa:</h1>
			<form>
        <label className="radio-inline"><input type="radio" name="1"></input>Pää</label>
				<label className="radio-inline"><input type="radio" name="1"></input>Keho</label>
        <label className="radio-inline"><input type="radio" name="1"></input>Eturaaja</label>
        <label className="radio-inline"><input type="radio" name="1"></input>Takaraaja</label>
      </form>
			<h1 className="h2">Pelin pituus:</h1>
			<form>
				<label className="radio-inline"><input type="radio" name="1"></input>10</label>
        <label className="radio-inline"><input type="radio" name="1"></input>20</label>
				<label className="radio-inline"><input type="radio" name="1"></input>30</label>
			</form>
			<h1 className="h2">Vaikeusaste</h1>
			<form>
				<label className="radio-inline"><input type="radio" name="1"></input>Helppo</label>
        <label className="radio-inline"><input type="radio" name="1"></input>Keskitasoa</label>
				<label className="radio-inline"><input type="radio" name="1"></input>Vaikea</label>
			</form>
			<div className="btn-group settingspage">
				<Link to='/writinggame'><button>Peliin >></button></Link>
			</div>
			</div>
			<div className="btn-group">
			<Link to='/game'><button>Takaisin</button></Link>
			</div>
	</div>
)

export default GameSettings