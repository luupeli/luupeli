import React from 'react';

class WGMessage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			message: 'Lällällää',
			style: '',
			counter: 0
		};
		this.componentWillUnmount = this.componentWillUnmount.bind(this)
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	mountTimer() {
		clearInterval(this.timer)
		this.setState({ counter: 5 })
		this.timer = setInterval(() => {
			this.setState({ counter: this.state.counter - 1 })
			console.log(this.state.counter)
			if (this.state.counter === 0) {
				clearInterval(this.timer)
			}
		}, 1000)
	}

	tick() {
		this.setState({
			counter: this.state.counter - 1
		})
		console.log(this.state.counter)
	}

	setMessage(message) {
		this.setState({ message: message })
		if (message !== "Oikein!") {
			this.setState({ style: "alert alert-danger" })
		} else {
			this.setState({ style: "alert alert-success" })
		}
	}

	setStyle(style) {
		this.setState({ style: style })
	}

	render() {
		return (
			<div className="WGMessage">
				{this.state.counter !== 0 && <div class={this.state.style} role="alert">
					<p>{this.state.message}</p>
				</div>}
			</div>
		);
	}
}

export default WGMessage;

