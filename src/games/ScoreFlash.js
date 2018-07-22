import React from 'react';
import { connect } from 'react-redux'

class ScoreFlash extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
       // const style = 'alert alert-' + `${this.props.scoreflash.style}`
        const style='blinder'   // <--- PLACEHOLDER CSS EFFECT!!!
		if (this.props.scoreflash !== undefined && this.props.scoreflash.scoreflash.length !== 0) {
			return (
				<div class={style} role="alert" text-align="center" vertical-align="middle" line-height="90px" position="fixed" >
					<h2>{this.props.scoreflash.scoreflash}</h2>
				</div>
			)
		} else {
			return (<br />)
		}
	}
}

const mapStateToProps = (state) => {
	return {
		scoreflash: state.scoreflash
	}
}

const ConnectedGameScoreFlash = connect(
	mapStateToProps,
	null
)(ScoreFlash)
export default ConnectedGameScoreFlash