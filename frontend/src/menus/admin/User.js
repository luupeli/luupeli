import React from 'react'
import userService from '../../services/users'
import userStatistics from '../../services/userStatistics'
import { Link, Redirect } from 'react-router-dom'
import BackButton from '../BackButton'
import Moment from 'moment';
import achievement from '../Achievement'
import Achievement from '../Achievement';

class User extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			allStyles: JSON.parse(localStorage.getItem("allStyles")),
			styleIndex: localStorage.getItem('styleIndex'),
			style: localStorage.getItem('style'),
			//userId is the id that was given in UserListing, inside Redirect
			userId: this.props.userId,
			redirect: false,
			redirectTo: '',
			//Some information about the user being viewed below
			viewedUserName: '',
			viewedUserEmail: '',
			totalGames: '',
			totalScore: 0,
			tempArr: [],
			usersBestGame: '',
			usersBestAnswers: [],
			//user is just the user viewing this page, nothing to do with the user
			//being viewed
			user: null,
			goBackTo: '/'
		}
	}

	componentDidMount() {
		//Let's fetch the user we want using userService, we already have the id,
		//so let's GET the user of that specific id
		//so we can put some useful information of them in the state
		userService.get(this.props.userId)
			.then((response) => {
				this.setState({
					viewedUserName: response.data.username,
					viewedUserEmail: response.data.email
				})
			})
		//We only need the number of played games, so we're saving the length of the response data
		userStatistics.getTotalGamesForIndividual(this.props.userId)
			.then((response) => {
				this.setState({
					totalGames: response.data.length
				})
			})

		//If the response data does not have a length of 0, the user
		//has played at least one game. Anyway, we're taking the first
		//game of the array, because it's the one with the most points
		//(backend sort)
		userStatistics.getUsersBestGames(this.props.userId)
			.then((response) => {
				if (response.data.length !== 0) {
					this.setState({
						usersBestGame: response.data[0]
					})
				}
			})
		//Again, if answers by this user exist, save them. Backend sorts them by score.
		userStatistics.getUsersBestAnswers(this.props.userId)
			.then((response) => {
				if (response.data.length !== 0) {
					this.setState({
						usersBestAnswers: response.data
					})
				}
			})
			.catch((error) => {
			//	console.log(error)
			})

			userStatistics.getTotalScore(this.props.userId)
			.then((response) => {
				if (response.data.length !== 0) {
					this.setState({
						totalScore: response.data
					})
					
				}
				
				})
			
		
				

		//And this is just for setting the user, although unless the user is an admin
		//or the very user this user page belongs to, they're going to need to gtfo
		//of this page immediately so then we're setting redirect to true and redirectTo to /login.
		const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			if (user.role !== "ADMIN" && user.id !== this.state.userId) {
				this.props.history.push('/')
			}
			this.setState({ user })
		} else {
			this.props.history.push('/login')
		}
	}

	//usersBestGame will be empty if this user has played no games,
	//as componentDidMount will set nothing to it. If it isn't empty,
	//return some information about this user's best game: points,
	//difficulty, time.
	bestGame() {
		if (this.state.usersBestGame !== '') {
			return (
				<div>
					<p>&#9733; Paras peli &#9733;</p>
					<p>{this.state.usersBestGame["totalScore"]} pistettä</p>
					<p>{this.state.usersBestGame["gameDifficulty"]}-tason {this.state.usersBestGame["gamemode"]}</p>
					<p>{Moment(this.state.usersBestGame["timeStamp"]).format('DD.MM.YYYY')}</p>
				</div>
			)
		}
	}

	bestAnswersTop5() {
		return (
			<div>
				<p>&#9733; Eniten pisteitä saaneet vastaukset &#9733;</p>
				{this.state.usersBestAnswers.map(answer => {
					return <p>"{answer.input}", {answer.points} pistettä ajassa {answer.seconds / 1000} s</p>
				}
				)}
			</div>
		)
	}

	render() {
		let i = this.state.styleIndex
		
		//If redirect is set to true, we will redirect. It might, no, WILL be true,
		//if the user trying to view this page is not an admin.
		if (this.state.redirect) {
			return (
				<Redirect to={{
					pathname: this.state.redirectTo,
				}} />
			)
		}
		let index = Achievement.getIndex(this.state.totalScore,this.state.totalGames)
		let rank = Achievement.getRank(index)

		let progressScore = Achievement.getGoal(this.state.totalScore,this.state.totalGames)
		let progressGames = Achievement.getGames(this.state.totalScore,this.state.totalGames)

		progressScore=Math.min(1.0,this.state.totalScore/progressScore)
		progressGames=Math.min(1.0,this.state.totalGames/progressGames)

		let totalProgress = Math.round(((0.66*progressScore)+(0.33*progressGames))*100)

		//If redirect is not true, AKA user is an admin, we can show them some
		//dank information of whomever this page belongs to.
		return (
			<div className={this.state.allStyles[i].overlay}>
				<div className={this.state.allStyles[i].background}>
					<div className={this.state.allStyles[i].style}>
						<div className="App">
							<BackButton action={() => this.props.history.push('/users')} />
							<font size="3"><div>
								<h2>Käyttäjä {this.state.viewedUserName}</h2>
								<h3>Arvonimesi: {rank}</h3>
								<h6>Edistymisesi seuraavalle taitotasolle: {totalProgress} %</h6>
								{/* <p>Sähköposti: {this.state.viewedUserEmail}</p>
								<br></br> */}
								<h3>Pelattuja pelejä: {this.state.totalGames}</h3>
								<h3>Pisteet yhteensä: {this.state.totalScore}</h3>
						
								<br></br>
								{this.bestGame()}
								<br></br>
								{this.bestAnswersTop5()}
							</div>
							</font>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default User
