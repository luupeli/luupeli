import { Redirect } from 'react-router-dom'
import React from 'react'
import ScoreFlash from './ScoreFlash'
import { connect } from 'react-redux'
import { gameInitialization, setAnswer } from '../reducers/gameReducer'
import gameSessionService from '../services/gameSessions'
import { injectGlobal } from 'styled-components'
import { setIntroSound } from '../reducers/soundReducer'
import ScoreBoard from './ScoreBoard'
import GameLoop from './GameLoop'
import Confetti from 'react-confetti'

/**
 * Gameloop is the parent component for 'hosting' different game modes of Luupeli.
 * Currently, two different game modes are supported.
 */

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToEndPage: false,
            style: localStorage.getItem('style'),
            user: null,
            allStyles: JSON.parse(localStorage.getItem("allStyles")),
            styleIndex: localStorage.getItem('styleIndex'),
        }
        this.postGameSession = this.postGameSession.bind(this)
        window.onunload = function () { window.location.href = '/' }
    };

    componentDidMount() {
        const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            this.setState({ user })
        }
        setInterval(() => {
            this.setState(() => {
                // console.log('test')
                return { unseen: "does not display" }
            });
        }, 500);
    }

    postGameSession() {
        gameSessionService.create({
            user: this.props.game.user !== null ? this.props.game.user.id : null,
            gamemode: this.props.game.gamemode,
            answers: this.props.game.answers,
            length: this.props.game.gameLength,
            gameDifficulty: this.props.game.gameDifficulty,
            animals: this.props.game.animals.map(animal => animal.id),
            bodyparts: this.props.game.bodyparts.map(bodypart => bodypart.id),
            seconds: this.props.game.totalSeconds / 20
        })
    }

    responsiveLayout() {
        const imageWidthR = () => {              // Here we try to measure the window size in order to resize the bone image accordingly
            const windowWidth = Math.max(
                document.body.scrollWidth,
                document.documentElement.scrollWidth,
                document.body.offsetWidth,
                document.documentElement.offsetWidth,
                document.documentElement.clientWidth
            )
            return Math.round(windowWidth * 1.0)
        }

        const imageHeightR = () => {              // Here we try to measure the window size in order to resize the bone image accordingly
            const windowHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight,
                document.documentElement.clientHeight
            )
            return Math.round(windowHeight * 1.0)
        }

        const scoreFlash = () => {
            if (this.props.scoreflash.visibility === true) {
                return (
                    <ScoreFlash />
                )
            }
        }
        const confettiGun = () => {
            var colors
            if (this.props.scoreflash.visibility && this.props.scoreflash.score > 0) {
                var numberOfPieces = Math.min(275, 25 +
                    Math.min(25, this.props.scoreflash.score / 10) +
                    Math.min(50, this.props.scoreflash.score / 50) +
                    Math.min(75, this.props.scoreflash.score / 250) +
                    Math.min(125, this.props.scoreflash.score / 1000))
                if (this.state.allStyles[this.state.styleIndex].style === 'fallout') {
                    colors = ['#39FF14', '#EEEEFF', '#55DD55', '#33BB33', '#229922']
                    return (<Confetti width={imageWidthR()} height={imageHeightR()} colors={colors} numberOfPieces={numberOfPieces} run={this.props.scoreflash.visibility} gravity={0.37} />)
                } else if (this.state.allStyles[this.state.styleIndex].style === 'blood-dragon') {
                    colors = ['#ff9de1', '#ff5db1', '#ff2596', '#ef007c', '#c04df9', '#ff48c4']
                    return (<Confetti width={imageWidthR()} height={imageHeightR()} colors={colors} numberOfPieces={numberOfPieces} run={this.props.scoreflash.visibility} gravity={0.37} />)
                } else {
                    return (<Confetti width={imageWidthR()} height={imageHeightR()} numberOfPieces={numberOfPieces} run={this.props.scoreflash.visibility} gravity={0.37} />)
                }
            } else {
                return null
            }
        }

        if ((imageWidthR() > imageHeightR() && imageWidthR() > 1000) || imageWidthR() > imageHeightR() * 1.3) {
            var progressWidth = Math.round((imageWidthR()) * 0.20);
            var gameBorder = Math.round(Math.min(7, (progressWidth * 5) / 100));
            var responsive = 'fifty'
            var heightRestriction = 50;
            if (imageHeightR() < 641 || imageWidthR() * 1.3 < imageHeightR()) {
                heightRestriction = 40;
                responsive = 'forty'
            } else if (imageHeightR() < 801) {
                heightRestriction = 45;
                responsive = 'fortyfive'
            }

            injectGlobal`
            :root {  
                --progress-max-width-forty: ${progressWidth}px;
                --progress-max-width-fortyfive: ${progressWidth}px;
                --progress-max-width-fifty: ${progressWidth}px;
                --game-border: ${gameBorder}px;
              }
              .score-board .col-md-offset-3 {
                margin: ${Math.round(progressWidth / 7)}px!important;
              }              
            }`

            /* REMOVED FROM INJECTION:   --image-height-restriction: ${heightRestriction}vh;*/
          
            return (
                <div className={responsive}>
                    {/* // {this.getConfetti(imageWidthR(),imageHeightR())} */}
                    <div className="transbox">
                        {confettiGun()}
                        <div className="game-mainview">
                            {/* <p>{imageWidthR()},{imageHeightR()}</p> */}
                            <div>
                                {scoreFlash()}
                            </div>
                            <GameLoop />
                        </div>
                        <div className="game-score">
                            <ScoreBoard progressWidth={progressWidth} previous={true} />
                        </div>
                    </div>
                </div>
            )
        } else {
            progressWidth = Math.round((imageWidthR()) * 0.75);
            injectGlobal`
            :root {  
                --progress-max-width: ${progressWidth}px;
                --progress-max-width-thirtythree: ${Math.round(progressWidth * 0.5)}px;
                --game-border: ${gameBorder}px;
              }
              .score-board .col-md-offset-3 {
                margin-left: 0!important; 
                margin-top: 5px!important;
              }
            }`
            /* REMOVED FROM INJECTION:   --image-height-restriction: 33vh;*/
            return (
                <div className="thirtythree">
                    <div className="transbox" margin="5">
                    {confettiGun()}
                        <div>
                            {/* <ScoreFlash /> */}
                            {scoreFlash()}
                        </div>
                        <div className="thirtythree">
                            <div className="game-mainview-mobile">
                                {/* <p>{imageWidthR()},{imageHeightR()}</p> */}
                                <GameLoop />
                            </div>
                        </div>
                    </div>
                    <div className="transbox" margin="5">
                        <div className="game-score-mobile">
                            <ScoreBoard progressWidth={progressWidth} previous={false} />
                        </div>
                    </div>
                </div>
            )
        }
    }

    /**
     *    If all images have been cycled through, redirect to endscreen, otherwise render quiz page 
     */
    render() {

        let i = parseInt(localStorage.getItem('styleIndex'), 10)
        // Here we inject the visual style specific colors into the css. Each visual style has a primary, secondary and tertiary color (accent).
        injectGlobal`
		:root {  
            --highlight: ${this.state.allStyles[i].highlight}
		  --primary: ${this.state.allStyles[i].primary}
		  --secondary: ${this.state.allStyles[i].secondary}
		  --tertiary: ${this.state.allStyles[i].tertiary}
		  }
        }`

        if (this.props.game.endCounter < 1) {
            setTimeout(function () {
                this.setState({ redirectToEndPage: true })
            }.bind(this), 3500)
            if (this.state.redirectToEndPage) {
                this.postGameSession()
                return (
                    <Redirect to={{
                        pathname: "/endscreen"
                    }} />
                )
            }
        }

        return (
            <div className={this.state.allStyles[i].overlay}>
                {/* {...this.props.size} /> */}
                <div className={this.state.allStyles[i].background}>
                    <div className={this.state.allStyles[i].style}>
                        <div id="App" className="App">
                            <div id="App" className="gameplay">
                                <div
                                    className={this.state.allStyles[i].flairLayerA}>
                                </div>
                                <div
                                    className={this.state.allStyles[i].flairLayerB}>
                                </div>
                                <div
                                    className={this.state.allStyles[i].flairLayerC}>
                                </div>
                                <div
                                    className={this.state.allStyles[i].flairLayerD}>
                                </div>
                                {this.responsiveLayout()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        game: state.game,
        message: state.message,
        scoreflash: state.scoreflash
    }
}

const mapDispatchToProps = {
    gameInitialization,
    setAnswer,
    setIntroSound
}

const ConnectedGame = connect(
    mapStateToProps,
    mapDispatchToProps
)(Game)
export default ConnectedGame