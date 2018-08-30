import React from 'react'
import { Row, Col } from 'react-bootstrap'
import BackButton from '../BackButton'

class Admin extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			allStyles: JSON.parse(localStorage.getItem("allStyles")),
			styleIndex: localStorage.getItem('styleIndex'),
			user: null
		}

		// Most likely a temporary fix, the browser back button works in a funny way...
		// it may take the user 'back' to a page they haven't event visited.
		// What we want this function to do is to take the user back to the page they were
		// on before Luupeli. Sometimes it does that. Nonetheless, it doesn't take the user
		// to some page they haven't been on, as far as I know.
	}

	componentDidMount() {
		const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			if (user.role !== "ADMIN") {
				this.props.history.push('/')
			}
			this.setState({ user })
		} else {
			this.props.history.push('/')
		}
	}

	// If redirect is set to true, we will redirect. Else, we will render the admin page,
	// which contains buttons leading to other pages meant for the admin.
	render() {
		let i = this.state.styleIndex

		return (
			<div className='App admin-bg'>
				<h2 className="admin-h2 text-info">Ylläpitäjän sivu</h2>
				<BackButton action={() => this.props.history.go(-1)} groupStyle="btn-group-vanilla" buttonStyle="gobackbutton btn btn-info" />
				<div id='adminButtons' className='btn-group-vanilla'>
					<Row className="show-grid">
						<Col>
							<button className="btn btn-info" id="boneList" onClick={() => this.props.history.push('/listing')}>
								Luut
           		</button>
						</Col>
					</Row>
					<Row className="show-grid">
						<Col>
							<button className="btn btn-info" id="userList" onClick={() => this.props.history.push('/users')}>
								Käyttäjät
           		</button>
						</Col>
					</Row>
					<Row className="show-grid">
						<Col>
							<button className="btn btn-info" id="adminStatistics" onClick={() => this.props.history.push('/statistics')}>
								Statistiikka
           		</button>
						</Col>
					</Row>
				</div>
			</div>
		)
	}
}

export default Admin
