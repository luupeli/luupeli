import React from 'react'
import userStatistics from '../services/userStatistics'
import BackButton from './BackButton'
import { Row, Col } from 'react-bootstrap'

//This leaderboard utilizes an array of 50 users sorted by points earned.
//It then shows 20 of them, since that seems like an appropriate amount.
//We might want to show more sometime.

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

	//We're using userStatistics to fetch an array of 50 users in decreasing order by points.
	//We're also calling bestPlayersAuxiliaryMethod, see what it does below.
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
	//Initialize an array for top 20. Remember, we have 50 users saved in this.state.
	//So let i = 5, if the 5th index of top50 is not undefined, AKA it holds a user,
	//put this user in top20AllTime in the form of "6. username (x pistettä)" (since i = 0 at first).
	//Otherwise, just put "6.". Then, we can easily use this array in render().
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
							<BackButton action={() => this.props.history.go(-1)} groupStyle="btn-group" buttonStyle="gobackbutton" />
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
