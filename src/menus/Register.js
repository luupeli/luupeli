import React from 'react'
import usersService from '../services/users'
import '../styles/App.css'

class Register extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			//style: localStorage.getItem('style'),
			allStyles: JSON.parse(localStorage.getItem("allStyles")),
			styleIndex: localStorage.getItem('styleIndex'),
			error: null,
			username: '',
			email: '',
			password: '',
			repeatPassword: '',
			user: null
		}

		this.signUp = this.signUp.bind(this)
		this.handleSignUpFieldChange = this.handleSignUpFieldChange.bind(this)
	}

	componentDidMount() {
		const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			this.setState({ user })
		}
	}

	signUp = async (event) => {
		event.preventDefault()
		try {
			const user = await usersService.create({
				username: this.state.username,
				email: this.state.email,
				password: this.state.password
			})
			console.log('user created:' + user.username)
			this.setState({
				username: '',
				email: '',
				password: '',
				repeatPassword: ''
			})
		} catch (error) {
			console.log(error)
			this.setState({ error: 'käyttäjätunnus tai salasana on virheellinen' })
			setTimeout(() => { this.setState({ error: null }) }, 5000)
		}
	}

	handleSignUpFieldChange = (event) => {
		this.setState({ [event.target.name]: event.target.value })
	}

	render() {
		let i = this.state.styleIndex
		console.log(this.state)
		return (
			<div className={this.state.allStyles[i].background}>
				<div className={this.state.allStyles[i].style}>
					<div className="App">
						<h2 className="toprow">"Luu-o" uusi</h2>
						<h2 className="secondrow">luukäyttäjätunnus</h2>
						<div
							className={this.state.allStyles[i].flairLayerA}>
						</div>
						<div
							className={this.state.allStyles[i].flairLayerB}>
						</div>
						<div
							className={this.state.allStyles[i].flairLayerC}>
						</div>
						<div
							className={this.state.allStyles[i].flairLayerD}>
						</div>
						<div class="transbox">
							<div className="align-center">
								<p>
									Käyttäjätunnuksen minimipituus on 3 merkkiä ja salasanan 8 merkkiä.
									Tunnus saa sisältää isoja ja pieniä kirjaimia (A-Z ja a-z) ja numeromerkkejä (0-9).
								</p>
							</div>
							<div className="login-clean">
								<form onSubmit={this.signUp}>
									<div className="align-center">
										<div className="form-group">
											<label for="username">Käyttäjätunnus:</label>
											<input
												className="form-control"
												type="text"
												name="username"
												placeholder="Käyttäjätunnus..."
												value={this.state.username}
												onChange={this.handleSignUpFieldChange}
												required
											/>
										</div>
										<div className="form-group">
											<label for="email">Sähköpostiosoite:</label>
											<input
												className="form-control"
												type="email"
												name="email"
												placeholder="Sähköpostiosoite..."
												value={this.state.email}
												onChange={this.handleSignUpFieldChange}
											/>
										</div>
										<div className="form-group">
											<label for="pass">Salasana:</label>
											<input
												className="form-control"
												type="password"
												name="password"
												placeholder="Salasana..."
												value={this.state.password}
												onChange={this.handleSignUpFieldChange}
												required
											/>
										</div>
										<div className="form-group">
											<label for="pass2">Toista salasana:</label>
											<input
												className="form-control"
												type="password"
												name="repeatPassword"
												placeholder="Toista salasana..."
												value={this.state.repeatPassword}
												onChange={this.handleSignUpFieldChange}
												required
											/>
										</div>
										<div className="form-group btn-group">
											<button
												className="btn btn-block"
												type="submit">
												Luo tili
											</button>
										</div>
										<div className="form-group">
											<p>Onko sinulla jo tili?<a href='/login'> Kirjaudu sisään!</a></p>
										</div>
									</div>
								</form>
							</div>
						</div>
						<div className="btn-group">
							<button
								id="goBackButton"
								className="gobackbutton"
								onClick={this.proceedToMain}>
								Takaisin
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
export default Register