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
		const style = 'scoreflash'   // <--- PLACEHOLDER CSS EFFECT!!! {this.props.scoreflash.score}

		const scoreActual = this.props.scoreflash.score 
		const durationOfScoreRise = Math.min(150,(scoreActual/50) + 25)

		let scoreShown =Math.min(scoreActual, Math.round(scoreActual*( this.props.game.gameClock /durationOfScoreRise)))

		//	position="fixed"
		
		let rowtext = this.props.scoreflash.streak+'' +this.props.scoreflash.streakemoji+''+scoreShown//+ ''+this.props.scoreflash.streakemoji
		
		if (scoreActual === 0) {
			rowtext=this.props.scoreflash.streakemoji+'VÄÄRIN!'+this.props.scoreflash.streakemoji
		}

		if (this.props.scoreflash !== undefined && this.props.game.gameClock<300 && this.props.scoreflash.scoreflash.length !== 0) {
			return (
				<Animated animationIn="rubberBand faster" animationOut="zoomOut faster" isVisible={this.props.scoreflash.visibility}>
					<div
						className={style}
						role="alert"
						text-align="center"
						vertical-align="middle"
						line-height="90px"
					
					>
		 <h3>
			{rowtext}
		 </h3>
					
					</div>
				</Animated>
			)
		}
		
		
		
		
		else 		
		
		{
			return (
				
			<br/>
			)
		}
	}



}
const mapStateToProps = (state) => {
	return {
		game: state.game,
		scoreflash: state.scoreflash
	}
}

const ConnectedGameScoreFlash = connect(
	mapStateToProps,
	null
)(ScoreFlash)
export default ConnectedGameScoreFlash