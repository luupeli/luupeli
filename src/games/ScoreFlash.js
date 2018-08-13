import React from 'react';
import Sound from 'react-sound';
import { connect } from 'react-redux'
import { Animated } from "react-animated-css";

/**
 * This class is used to render a score flash each time the player progresses to a point where points are awarded (i.e. typing a correct answer). 
 * React-animated-css animations are used inside the render() method.
 * The score flash originates from the scoreFlashReducer class. 
 */
class ScoreFlash extends React.Component {

	handleSound(gameClock, scoreRiseTime,scoreActual) {

		var playbackspeed=1.0; 
		if (scoreActual<500) {
			playbackspeed=1.0-(scoreActual/100);
		}
		if (scoreActual>1000) {
			playbackspeed=Math.min(4,1.0+(scoreActual/2500));
		}
		
		if (gameClock<scoreRiseTime &&  this.props.game.playSound) {
			return (
				
			<Sound
			url="/sounds/253172__suntemple__retro-bonus-pickup-sfx.wav"
				playStatus={Sound.status.PLAYING}
				// playFromPosition={0 /* in milliseconds */}
				playbackRate={playbackspeed}
				onLoading={this.handleSongLoading}
				onPlaying={this.handleSongPlaying}
				onFinishedPlaying={this.handleSongFinishedPlaying}
			  />
			)
		}
	}

	/**
	 * The score flash is not properly styled yet. The idea is, that the more score the player receives, the "flashier" the effect.
	 * Also, "zero points" should probably have some noticeable vfx as well.
	 */
	render() {
		// const style = 'alert alert-' + `${this.props.scoreflash.style}`
		const style = 'scoreflash'   // <--- PLACEHOLDER CSS EFFECT!!! {this.props.scoreflash.score}
		const gameClock = Math.round(((new Date).getTime()-this.props.game.startTime)/50)
		const scoreActual = this.props.scoreflash.score 
		const durationOfScoreRise = Math.min(30,(scoreActual/10) + 5)
		console.log('scoreFlash: gameclock: '+gameClock)
		let scoreShown =Math.min(scoreActual, Math.round(scoreActual*( gameClock /durationOfScoreRise)))

		let scoreShownForDelayedSound =Math.min(scoreActual*1.4, Math.round(scoreActual*( gameClock /durationOfScoreRise)))
		let durationOfScoreRiseForSound = Math.min(30,(scoreActual/10) + 5)+5
		//	position="fixed"
		
		let rowtext = this.props.scoreflash.streak+'' +this.props.scoreflash.streakemoji+''+scoreShown//+ ''+this.props.scoreflash.streakemoji
		
		if (scoreActual === 0) {
			rowtext=this.props.scoreflash.streakemoji+'VÄÄRIN!'+this.props.scoreflash.streakemoji
		}

		if (this.props.scoreflash !== undefined && gameClock<60 && this.props.scoreflash.scoreflash.length !== 0) {
			return (
				<Animated animationIn="rubberBand faster" animationOut="zoomOut faster" isVisible={this.props.scoreflash.visibility}>
					<div
						className={style}
						role="alert"
						text-align="center"
						vertical-align="middle"
						line-height="90px"
						z-index="1000"
					>
		 <h3>
			{rowtext}
			{/* {this.handleSound(scoreShownForDelayedSound,scoreActual)} */}
			{this.handleSound(gameClock ,durationOfScoreRiseForSound,scoreActual)}
		 </h3>
					
					</div>
				</Animated>
			)
		}
		
		
		
		else {
			return null;
		}
		// else 		
		
		// {
		// 	return (
				
		// 	<br/>
		// 	)
		// }
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