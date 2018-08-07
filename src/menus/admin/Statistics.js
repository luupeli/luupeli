import React from 'react'
import { Link, Redirect } from 'react-router-dom'

class Statistics extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
		}
		window.onunload = function () { window.location.href = '/' }
	}

	componentDidMount() {
		const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			if (user.role !== "ADMIN") {
				this.setState({ redirect: true, redirectTo: '/' })
			}
			this.setState({ user })
		} else {
			this.setState({ redirect: true, redirectTo: '/' })
		}
	}

	render() {
		if (this.state.redirect) {
			return (
				<Redirect to={{
					pathname: this.state.redirectTo,
				}} />
			)
		}
		return (
			<div className="menu-background App">
				<Link to='/admin'>
					<button className="gobackbutton">Takaisin</button>
				</Link>
				<p>Lällällää</p>
			</div >
		)
	}
}

export default Statistics
