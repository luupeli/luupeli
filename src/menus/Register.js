import React from 'react'
import '../styles/App.css'

class Register extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			style: localStorage.getItem('style')
		}
	}

	render() {
		return (
			<div class="App">
				<div class="login-clean">
					<form method="post">
						<div class="align-center">

							<p>Käyttäjätunnuksen minimipituus on 3 merkkiä ja salasanan 8 merkkiä.
		Tunnus saa sisältää isoja ja pieniä kirjaimia (A-Z ja a-z) ja numeromerkkejä (0-9).
							</p>

							<div class="form-group">
								<label for="username">Käyttäjätunnus:</label>
								<input class="form-control" type="text" placeholder="Käyttäjätunnus..." name="username" required ></input>
							</div>

							<div class="form-group">
								<label for="email">Sähköpostiosoite:</label>
								<input class="form-control" type="text" placeholder="Sähköpostiosoite..." name="email" required></input>
							</div>

							<div class="form-group">
								<label for="pass">Salasana:</label>
								<input class="form-control" type="password" placeholder="Salasana..." name="pass" required></input>
							</div>

							<div class="form-group">
								<label for="pass2">Toista salasana:</label>
								<input class="form-control" type="password" placeholder="Toista salasana..." name="pass2" required></input>
							</div>

							<div class="form-group btn-group">
								<button class="btn btn-block" type="submit">Luo tili</button>
							</div>

							<div class="form-group">
								<p>Onko sinulla jo tili?<a href='/login'> Kirjaudu sisään!</a></p>
							</div>

						</div>
					</form>
				</div>
			</div>
		)
	}
}
export default Register