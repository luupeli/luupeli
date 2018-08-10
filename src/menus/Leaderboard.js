import React from 'react'
import userService from '../services/users'
import { Link, Redirect } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'

class Leaderboard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			bestPlayersTop20AllTime: []
		}
		window.onunload = function () { window.location.href = '/' }
	}

	componentDidMount() {
		const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			this.setState({ user })
		}
		var top20AllTime = []
		var i
		for (i = 1; i <= 20; i++) {
			top20AllTime[i] = i + '.'
		}
		this.setState({ bestPlayersTop20AllTime: top20AllTime })
	}

	render() {
		return (
			<div className="menu-background App">
				<h2>&#9733; Eniten pisteitä (kaikilta ajoilta) &#9733;</h2>
				<Link to='/'>
					<button className="gobackbutton">Takaisin</button>
				</Link>
				<Row>
					<Col>
					{this.state.bestPlayersTop20AllTime.map(index =>{
						return <p>{index}</p>
					})}
					</Col>
				</Row>
			</div >
		)
	}
}

export default Leaderboard
