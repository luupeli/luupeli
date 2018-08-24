import React from 'react';
import { connect } from 'react-redux'

// This class is used to render page header message boxes throughout the application.
class Message extends React.Component {
	render() {
		const style = `alert alert-${this.props.message.style}`
		if (this.props.message !== undefined && this.props.message.text.length !== 0) {
			return (
				<div className={style} role="alert">
					<p>
						{this.props.message.text}
					</p>
				</div>
			)
		} else {
			return null
			
			// (
			// 	<br />
			// )
		}
	}
}

const mapStateToProps = (state) => {
	return {
		message: state.message
	}
}

const ConnectedGameMessage = connect(
	mapStateToProps,
	null
)(Message)
export default ConnectedGameMessage