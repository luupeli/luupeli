import React from 'react'
import { Redirect } from 'react-router-dom'

class BackButton extends React.Component {
	constructor(props) {
    super(props)
    this.state = {
      redirect: false
    }
    this.proceedToPage = this.proceedToPage.bind(this)
  }
  
  proceedToPage() {
		this.setState({ redirect: true })
		this.setState({ redirectTo: this.props.redirectTo })
	}
  
  render() {
		if (this.state.redirect === true) {
			return (
				<Redirect to={this.props.redirectTo}  />
			)
		}
		
		return (
			<div className="btn-group">
				<button
					id="goBackButton"
					className="gobackbutton"
					onClick={this.proceedToPage}>
					Takaisin
				</button>
			</div>
		)
	}
}

export default BackButton
