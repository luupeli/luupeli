import { Redirect } from 'react-router-dom'
import React from 'react'
import Message from './Message'
import ScoreFlash from './ScoreFlash'
import WritingGame from './WritingGame'
import MultipleChoiceGame from './MultipleChoiceGame'
import ImageMultipleChoiceGame from './ImageMultipleChoiceGame'
import { connect } from 'react-redux'
import { gameInitialization, setAnswer, advanceGameClock } from '../reducers/gameReducer'
import { ProgressBar } from 'react-bootstrap'
import { injectGlobal } from 'styled-components'

/**
 * Gameloop is the parent component for 'hosting' different game modes of Luupeli.
 * Currently, two different game modes are supported.
 */
class GameLoop extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redirectToEndPage: false,
            style: localStorage.getItem('style'),
            user: null,
            seconds: 0,
            scoreSeconds: 0,
            streak: 0,
            bonus: 1.0,
            currentScore: 0,
            currentScoreFlash: '',
            currentScoreFlashStyle: '',
            currentScoreFlashTime: 0,
            currentScoreFlashCutOff: 0,
            currentScoreFlashVisibility: false,
            allStyles: JSON.parse(localStorage.getItem("allStyles")),
            styleIndex: localStorage.getItem('styleIndex'),
        };
    }


    /**
   * Here we increase the game's internal clock by one unit each tick. 
   * "seconds" refers to the time spent answering the current question, while
   * "secondsTotal" refers to the total time spent answering all the questions so far.
   * 
   * The tick is currently set at 100 milliseconds meaning that 1 actual second is actually 10 tick-seconds.
   * This is done simply to make the time-based scoring feel more granular.
   */
    tick() {

        this.props.advanceGameClock()
    }

    /**
     * With the component mounting, the game time measuring tick() is set at 100 milliseconds.
     */
    componentWillMount() {

        this.interval = setInterval(() => this.tick(), 10);
    }
    /**
     * At component unmount the interval needs to be cleared.
     */
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentDidMount() {
        const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            this.setState({ user })
        }
    }

    /**
     * Method for rendering the Gameloop page header (containing ProgressBar)
     */
    topPage() {
        let progressBar = <ProgressBar bsStyle="info" now={0} key={0} />
        let correctAnswers = []
        if (this.props.game.answers !== undefined) {
            correctAnswers = this.props.game.answers.filter(ans => ans.correctness === 100)

            progressBar = this.props.game.answers.map(ans => {
                if (ans.correctness === 100) {
                    return <ProgressBar active bsStyle="success" now={(1 / this.props.game.gameLength) * 100} key={ans.image.id} />
                } else if (ans.correctness > 70 && ans.correctness < 100) {
                    return <ProgressBar active bsStyle="warning" now={(1 / this.props.game.gameLength) * 100} key={ans.image.id} />
                } else {
                    return <ProgressBar active bsStyle="danger" now={(1 / this.props.game.gameLength) * 100} key={ans.image.id} />
                }
            })
        }

        return (
            <div>
                <div>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 col-md-offset-3">
                                <ProgressBar label={`moi`}>
                                    {progressBar}
                                </ProgressBar>
                                <p>Täysin oikein {correctAnswers.length}/{this.props.game.gameLength}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    /**
     * Method for rendering selected game mode
     */
    gameLoop() {
        if (this.props.game.endCounter > 0) {
            if (this.props.game.gamemode === 'kirjoituspeli') {
                return (
                    <WritingGame />
                )
            } else if (this.props.game.gamemode === 'monivalintapeli') {
                if (this.props.game.surpriseGameMode < 2) {
                    return <MultipleChoiceGame />
                } else {
                    return <ImageMultipleChoiceGame />
                }
            } else {
                if (this.props.game.surpriseGameMode <= 1) {
                    return <MultipleChoiceGame />
                } else if (this.props.game.surpriseGameMode <= 2) {
                    return <ImageMultipleChoiceGame />
                } else {
                    return <WritingGame />
                }
            }
        }

        else if (this.props.game.gamemode === 'kirjoituspeli') {
            return (
                <WritingGame />
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

        if (this.props.game.endCounter === 0) {
            setTimeout(function () {
                this.setState({ redirectToEndPage: true })
            }.bind(this), 3500)
            if (this.state.redirectToEndPage) {
                return (
                    <Redirect to={{
                        pathname: "/endscreen"
                    }} />
                )
            }
        }

        const scoreActual = this.props.scoreflash.score 
		const durationOfScoreRise = Math.min(150,(scoreActual/50) + 25)

        let scoreShown =  this.props.game.totalScore-scoreActual + Math.min(scoreActual, Math.round(scoreActual*( this.props.game.gameClock /durationOfScoreRise)))

        return (


            <div className={this.state.allStyles[i].overlay}>
            <div className={this.state.allStyles[i].background}>
                <div className={this.state.allStyles[i].style}>
              
                    <div id="App" className="App">
                  
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
                        <div className="transbox">
                        <div className="btn-group">
                    <div classNAme="gobackbutton">
                        <h3>SCORE {scoreShown}</h3>
                        </div>
                        </div>
                {this.topPage()}
                
                <div className="ffdual-layout">
                
                    {/* <div className="container"> */}
                    <div>
                            <ScoreFlash ref={instance => this.wgmessage = instance} />
                        </div>    
                        <div>
                            <Message />
                        </div>
                        {this.gameLoop()}
                    </div>
                </div>
            </div>
            </div>
            </div>
            </div>

        );
    }

}
//<ScoreFlash />ref={instance => this.wgmessage = instance} />


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
    advanceGameClock
}

const ConnectedGameLoop = connect(
    mapStateToProps,
    mapDispatchToProps
)(GameLoop)
export default ConnectedGameLoop