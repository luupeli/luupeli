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
import gameSessionService from '../services/gameSessions'
import bodyPartService from '../services/bodyParts'
import animalService from '../services/animals'
import { injectGlobal } from 'styled-components'
import Sound from 'react-sound';
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
            introMusicHasFinished: false,
            currentScore: 0,
            currentScoreFlash: '',
            currentScoreFlashStyle: '',
            currentScoreFlashTime: 0,
            currentScoreFlashCutOff: 0,
            currentScoreFlashVisibility: false,
            allStyles: JSON.parse(localStorage.getItem("allStyles")),
            styleIndex: localStorage.getItem('styleIndex')
        }
        this.postGameSession = this.postGameSession.bind(this)
        this.handleSongFinishedPlaying = this.handleSongFinishedPlaying.bind(this)
    };



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
     * With the component mounting, the game time measuring tick() is set at 50 milliseconds.
     */
    componentWillMount() {

        this.interval = setInterval(() => this.tick(), 50);
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

    postGameSession() {
        let userToBePosted
        if (this.state.user !== null) {
            userToBePosted: this.state.user.id
        }
        gameSessionService.create({
            user: userToBePosted,
            mode: this.props.game.gamemode,
            length: this.props.game.gameLength,
            difficulty: this.props.game.difficulty,
            animals: this.props.game.animals.map(animal => animal.id),
            bodyparts: this.props.game.bodyparts.map(bodypart => bodypart.id),
            correctAnswerCount: this.props.game.answers.filter(ans => ans.correctness === 100).length,
            almostCorrectAnswerCount: this.props.game.answers.filter(ans => ans.correctness > 70 && ans.correctness < 100).length,
            seconds: this.props.game.totalSeconds / 20
        })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    handleSongFinishedPlaying() {
        this.setState({ introMusicHasFinished: true })

    }

    handleSound() {
        if (!this.state.introMusicHasFinished && this.props.game.gameLength === this.props.game.endCounter) {
            return (

                <Sound
                    url="/sounds/393385__fred1712__chiptune-intro-1.wav"
                    playStatus={Sound.status.PLAYING}
                    // playFromPosition={0 /* in milliseconds */}
                    onLoading={this.handleSongLoading}
                    onPlaying={this.handleSongPlaying}
                    onFinishedPlaying={this.handleSongFinishedPlaying}
                />
            )
        }
        if (this.props.game.gameLength > this.props.game.endCounter) {


            if (this.props.game.answers[this.props.game.gameLength - (this.props.game.endCounter + 1)].score > 0 && this.props.game.gameClock < 36) {
                return (

                    <Sound
                        url="/sounds/391540__mativve__electro-success-sound.wav"
                        playStatus={Sound.status.PLAYING}
                        // playFromPosition={0 /* in milliseconds */}
                        onLoading={this.handleSongLoading}
                        onPlaying={this.handleSongPlaying}
                        onFinishedPlaying={this.handleSongFinishedPlaying}
                    />
                )
            } else if (this.props.game.answers[this.props.game.gameLength - (this.props.game.endCounter + 1)].score === 0 && this.props.game.gameClock < 6) {
                return (

                    <Sound
                        url="/sounds/142608__autistic-lucario__error.wav"
                        playStatus={Sound.status.PLAYING}
                        // playFromPosition={0 /* in milliseconds */}
                        onLoading={this.handleSongLoading}
                        onPlaying={this.handleSongPlaying}
                        onFinishedPlaying={this.handleSongFinishedPlaying}
                    />
                )
            }
        }

    }

    /**
     * Method for rendering the Gameloop page header (containing ProgressBar)
     */
    topPage(scoreShown) {
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
            <div width="95%">
                
                    {/* <div className="container"> */}
                    {/* <div className="row"> */}
                    <h6>{correctAnswers.length}/{this.props.game.gameLength}</h6>
                    <div className="col-md-6 col-md-offset-3">
                        <ProgressBar label={`moi`}>
                            {progressBar}
                        </ProgressBar>
                    </div>
                    
                    
                    
                <h3>SCORE {scoreShown}</h3>
                <h5>TIME {Math.round(this.props.game.gameClock / 20, 1)}</h5>
            </div>
            // </div>
            // </div>
        )
    }

    responsiveLayout(scoreShown) {

        const imageWidthR = () => {              // Here we try to measure the window size in order to resize the bone image accordingly
            const windowWidth = Math.min(
                document.body.scrollWidth,
                document.documentElement.scrollWidth,
                document.body.offsetWidth,
                document.documentElement.offsetWidth,
                document.documentElement.clientWidth
            )
            // if (windowWidth > 1000) {
            //     return 1000
            // }
            return Math.round(windowWidth * 1.0)
        }

        const imageHeightR = () => {              // Here we try to measure the window size in order to resize the bone image accordingly
            const windowHeight = Math.min(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight,
                document.documentElement.clientHeight
            )
            // if (windowHeight > 1000) {
            //     return 1000
            // }
            return Math.round(windowHeight * 1.0)
        }

        if (imageWidthR() > imageHeightR() && imageWidthR()> 1000) {
            injectGlobal`
            :root {  
                --image-height-restriction: 50vh;
              }
            }`

            return (
                <div className="transbox">
                    <div>
                                        <ScoreFlash ref={instance => this.wgmessage = instance} />
                                    </div>
                    <div className="game-mainview">
                    {/* <p>{imageWidthR()},{imageHeightR()}</p> */}

                        {this.gameLoop()}
                    </div>
                    <div className="game-score">
                        {this.topPage(scoreShown, true)}
                    </div>
                </div>
            )
        } else {

            injectGlobal`
            :root {  
                --image-height-restriction: 33vh;
              }
            }`

            return (
                <div>
                <div className="transbox" margin="5">
                <div>
                                        <ScoreFlash ref={instance => this.wgmessage = instance} />
                                    </div>
                <div className="game-mainview-mobile">
                {/* <p>{imageWidthR()},{imageHeightR()}</p> */}
                    {this.gameLoop()}
                </div>
                </div>
                <div className="transbox" margin="5">
                <div className="game-score-mobile">
                    {this.topPage(scoreShown, false)}
                </div>
                </div>
            </div>

            )
        }
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

        const scoreActual = this.props.scoreflash.score
        const durationOfScoreRise = Math.min(30, (scoreActual / 10) + 5)
        let scoreShown = this.props.game.totalScore - scoreActual + Math.min(scoreActual, Math.round(scoreActual * (this.props.game.gameClock / durationOfScoreRise)))

        return (


            <div className={this.state.allStyles[i].overlay}>
                <div className={this.state.allStyles[i].background}>
                    <div className={this.state.allStyles[i].style}>
                        <div id="App" className="App">
                            {this.handleSound()}
                            
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
                            

                                   

                                    {this.responsiveLayout(scoreShown)}
                                    

                                {/* </div> */}



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
