import React from 'react';
import { connect } from 'react-redux'
import { Animated } from "react-animated-css";

/**
 * This class is used to render a score flash each time the player progresses to a point where points are awarded (i.e. typing a correct answer). 
 * React-animated-css animations are used inside the render() method.
 * The score flash originates from the scoreFlashReducer class. 
 */
class ScoreFlash extends React.Component {
	/**
	 * The score flash is not properly styled yet. The idea is, that the more score the player receives, the "flashier" the effect.
	 * Also, "zero points" should probably have some noticeable vfx as well.
	 */
	render() {
		// const style = 'alert alert-' + `${this.props.scoreflash.style}`
		const style = 'blinder'   // <--- PLACEHOLDER CSS EFFECT!!!
		if (this.props.scoreflash !== undefined && this.props.scoreflash.scoreflash.length !== 0) {
			return (
				<Animated animationIn="bounceInLeft" animationOut="bounceOutRight" isVisible={this.props.scoreflash.visibility}>
					<div
						class={style}
						role="alert"
						text-align="center"
						vertical-align="middle"
						line-height="90px"
						position="fixed"
					>
						<h2 data-animation-out="animate-out fadeOutUp">
							{this.props.scoreflash.scoreflash}
						</h2>
					</div>
				</Animated>
			)
		} else {
			return (
				<br />
			)
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