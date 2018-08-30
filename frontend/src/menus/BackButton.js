import React from 'react'

class BackButton extends React.Component {
	constructor(props) {
    super(props)
  }
  
  render() {
	
		return (
			<div className={this.props.groupStyle}>
				<button
					id="goBackButton"
					className={this.props.buttonStyle}
					onClick={this.props.action}>
					Takaisin
				</button>
			</div>
		)
	}
}

export default BackButton
