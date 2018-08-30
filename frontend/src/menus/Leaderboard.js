import React from 'react'
import userStatistics from '../services/userStatistics'
import BackButton from './BackButton'
import { Row, Col } from 'react-bootstrap'

class Leaderboard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			allStyles: JSON.parse(localStorage.getItem("allStyles")),
      styleIndex: localStorage.getItem('styleIndex'),
			top50: [],
			bestPlayersTop20AllTime: []
		}
		window.onunload = function () { window.location.href = '/' }
		this.setBestPlayers = this.setBestPlayers.bind(this)
	}

	componentDidMount() {
		this.setBestPlayers()
		const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			this.setState({ user })
		}
	}
	
	proceedToMain(event) {
		this.setState({ redirect: true })
		this.setState({ redirectTo: '/' })
  }

	setBestPlayers() {
		userStatistics.getTop50()
			.then((response) => {
				this.setState({ top50: response.data })
				this.bestPlayersAuxiliaryMethod()
			})
			.catch((error) => {
				console.log(error)
			})
	}

	bestPlayersAuxiliaryMethod() {
		var top20AllTime = []
		var i
		for (i = 0; i < 20; i++) {
			if (this.state.top50[i] !== undefined) {
				top20AllTime[i] = i + 1 + '. ' + this.state.top50[i].user.username
					+ ' (' + this.state.top50[i].total + ' pistettä)'
			} else {
				top20AllTime[i] = i + 1 + '. '
			}
		}
		this.setState({ bestPlayersTop20AllTime: top20AllTime })
	}

	render() {
		let i = this.state.styleIndex
		
		return (
			<div className={this.state.allStyles[i].overlay}>
				<div className={this.state.allStyles[i].background}>
          <div className={this.state.allStyles[i].style}>
						<div className="App">
							<h3>&#9733; Eniten pisteitä&#9733;</h3>
							<h6>(Kaikkien aikojen ennätykset)</h6>
							<BackButton redirectTo='/' groupStyle="btn-group" buttonStyle="gobackbutton" />
							<Row>
								<Col>
									{this.state.bestPlayersTop20AllTime.map(index => {
										return <p>{index}</p>
									})}
								</Col>
							</Row>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Leaderboard
