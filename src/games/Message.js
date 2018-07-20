import React from 'react';
import { connect } from 'react-redux'

class Message extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const style = 'alert alert-' + `${this.props.message.style}`
		if (this.props.message !== undefined && this.props.message.text.length !== 0) {
			return (
				<div class={style} role="alert">
					<p>{this.props.message.text}</p>
				</div>
			)
		} else {
			return (<br />)
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