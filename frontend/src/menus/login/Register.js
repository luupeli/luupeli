import React from 'react'
import usersService from '../../services/users'
import loginService from '../../services/login'
import { Link, Redirect } from 'react-router-dom'
import '../../styles/App.css'
import BackButton from '../BackButton'

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            allStyles: JSON.parse(localStorage.getItem("allStyles")),
            styleIndex: localStorage.getItem('styleIndex'),
            error: null,
            redirect: false,
            username: '',
            email: '',
            password: '',
            repeatPassword: '',
            user: null
        }

        this.signUp = this.signUp.bind(this)
        this.handleSignUpFieldChange = this.handleSignUpFieldChange.bind(this)

        window.onunload = function() { window.location.href = '/' };
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
        // If the user has successfully confirmed their password,
        // we can try to create a new user. This might fail,
        // if, for example, the password is too short.
        // Backend handles these checks. A new user is created through userService.
        if (this.checkPasswordMatch(this.state.password, this.state.repeatPassword)) {
            try {
                const user = await usersService.create({
                    username: this.state.username,
                    email: this.state.email,
                    password: this.state.password
                })
                console.log('user created:' + user.username)
                const userToBeLoggedIn = await loginService.login({
                    username: this.state.username,
                    password: this.state.password
                })
                window.sessionStorage.setItem('loggedLohjanLuunkeraajaUser', JSON.stringify(userToBeLoggedIn))
                this.setState({
                    username: '',
                    email: '',
                    password: '',
                    repeatPassword: '',
                    user
                })
                this.setState({ redirect: true })
                // If we end up here, a new user could not be created. Backend rejected the request.
            } catch (error) {
                console.log(error)
                this.setState({ error: 'käyttäjätunnus tai salasana on virheellinen' })
                setTimeout(() => { this.setState({ error: null }) }, 5000)
            }
            // If we end up here, the passwords didn't match. Put this information in the state.
            // And then, after some time, set error to null again.
        } else {
            this.setState({ error: 'salasanat eivät täsmää' })
            setTimeout(() => { this.setState({ error: null }) }, 5000)
        }
    }

    // The user needs to confirm their password, and the inputs need to match.
    // Here we check that.
    checkPasswordMatch(pass, pass2) {
        return pass === pass2
    }

    // Put the user's username, email etc. in the state so we can create an account for them
    // in signUp. We'll need the state information there.
    handleSignUpFieldChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    // Here we render the registration page. Input fields for username, email, password and password confirmation.
    // Also a button for creating an account, one for going back to the previous page, and one for going to
    // the login page in case the user wants to sign in instead of signing up.
    render() {
        if (this.state.redirect) {
            return (
                <Redirect to="/" />
            )
        }
        let i = this.state.styleIndex
        console.log(this.state)
        return (
            <div id="registerMenu" className="App">
                <div className={this.state.allStyles[i].overlay}>
                    <div className={this.state.allStyles[i].background}>
                        <div className={this.state.allStyles[i].style}>
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
                            <div className="container">
                                <div className="transbox">
                                    <div className="align-center">
                                        <p>
                                            Käyttäjätunnuksen minimipituus on 3 merkkiä ja salasanan 8 merkkiä.
											Tunnus saa sisältää isoja ja pieniä kirjaimia (A-Z ja a-z) ja numeromerkkejä (0-9).
										</p>
                                    </div>
                                    <div className="login-clean">
                                        <span id="error-message">{this.state.error}</span>
                                        <form onSubmit={this.signUp}>
                                            <div className="align-center">
                                                <div className="form-group">
                                                    <label for="username">Käyttäjätunnus:</label>
                                                    <input
                                                        className="form-control"
                                                        id="username-form"
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
                                                        id="password-form"
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
                                                        id="repeat-password-form"
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
                                                    id="signup-button"
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
                            </div>
                            <BackButton redirectTo='/' />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Register
