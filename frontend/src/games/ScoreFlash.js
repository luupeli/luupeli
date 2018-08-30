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

	componentDidMount() {
		setInterval(() => {
			this.setState(() => {
				// console.log('test')
				return { unseen: "does not display" }
			});
		}, 100);
		}

	handleSound(scoreActual,playStatus) {
		var playbackspeed = 1.0;
		if (scoreActual < 500) {
			playbackspeed = 1.0 - (scoreActual / 100);
		}
		if (scoreActual > 1000) {
			playbackspeed = Math.min(4, 1.0 + (scoreActual / 2500));
		}

		
		

		if (this.props.game.playSound && scoreActual > 0 && (this.props.scoreflash.startPlayingBonusSound || playStatus===Sound.status.STOPPED)) {
			return (
				<Sound
					url="/sounds/253172__suntemple__retro-bonus-pickup-sfx.wav"
					playStatus={playStatus}
					loop={true}
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
		const style = this.props.scoreflash.style //'scoreflash'   // <--- PLACEHOLDER CSS EFFECT!!! {this.props.scoreflash.score}
		var gameClock = new Date().getTime() - this.props.scoreflash.startTime
		const scoreActual = this.props.scoreflash.score

		const durationOfScoreRise = Math.min(30, (scoreActual / 10) + 5) * 50

		let scoreShown = Math.min(scoreActual, Math.round(scoreActual * (gameClock / durationOfScoreRise)))
		console.log('scoreFlash: gameclock: ' + gameClock + ', scoreShown: ' + scoreShown)
	//	let scoreShownForDelayedSound = Math.min(scoreActual * 1.4, Math.round(scoreActual * (gameClock / durationOfScoreRise)))
		let durationOfScoreRiseForSound = Math.min(30, (scoreActual / 10) + 5) + 5
		//	position="fixed"

		let rowtext = ''
			//this.props.scoreflash.streak + '' + 
			//this.props.scoreflash.streakemoji + '' +
		let scoreText =	'' + scoreShown + ''.toString()//+ ''+this.props.scoreflash.streakemoji

		if (scoreActual === 0) {
			rowtext = 'VÄÄRIN!'//this.props.scoreflash.streakemoji + 'VÄÄRIN!' + this.props.scoreflash.streakemoji
		} else if (style==='almostcorrect') {
			rowtext = 'AIKA LÄHELLE!'
		} else if (style==='correct') {
			rowtext = 'OIKEIN!'
		} else {
			rowtext = 'NIMI & ELÄIN OIKEIN!!'
		}
	
		var rowtextLeft = rowtext.substring(0, rowtext.length / 2)
		var rowtextRight = rowtext.substring(rowtext.length / 2, rowtext.length)
		var playStatus = Sound.status.PLAYING
		if (scoreShown>=scoreActual) {
			playStatus = Sound.status.STOPPED
		}

		return (<div z-index="1000">
			<Animated animationIn="bounceInDown faster" animationOut="bounceOutUp faster" isVisible={this.props.scoreflash.visibility}>
				<div
					className="scoreflash"
					role="alert"
					text-align="center"
					vertical-align="middle"
					line-height="90px"
					z-index="1000"
					position="relative"
					margin="5px"
				>
				<div className={style} z-index="1000">

				<Animated animationIn="zoomIn faster" animationOut="zoomOut faster" isVisible={this.props.scoreflash.visibility}>
					<h6>{rowtext}</h6>
					<h2>{scoreText}</h2>
					<h6>{this.props.scoreflash.streak}</h6>
				</Animated>
					{/* <h3>{this.props.scoreflash.streak}{this.props.scoreflash.streakemoji}</h3> */}

					 {/* <h3><Animated animationIn="bounceInLeft faster" animationOut="bounceOutLeft faster" isVisible={this.props.scoreflash.visibility}>{rowtextLeft}</Animated>
					 	<Animated animationIn="bounceInRight faster" animationOut="bounceOutRight faster" isVisible={this.props.scoreflash.visibility}>{rowtextRight}</Animated>
					 </h3> */}

					{/* <Animated animationIn="bounceInUp faster" animationOut="bounceOutDown faster" isVisible={this.props.scoreflash.visibility}><h3>{this.props.scoreflash.streak}{this.props.scoreflash.streakemoji}</h3></Animated> */}

				</div>
				</div>
			</Animated>
			{this.handleSound(scoreActual,playStatus)}
		</div>
		)
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
