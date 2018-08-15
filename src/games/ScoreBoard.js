
import React from 'react'
import { connect } from 'react-redux'
import { ProgressBar } from 'react-bootstrap'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { Animated } from "react-animated-css";

class ScoreBoard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            seconds: 0,
            score: 0,
            previousImage: '',
            previousUrl: 'none'
        }

        this.reminderOfPreviousImage = this.reminderOfPreviousImage.bind(this)
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
        if (this.state.seconds === 1 && this.state.previousImage === '') {
            this.setState({ seconds: this.getElapsedTime(), score: this.scoreToShow(), previousImage: this.props.game.currentImage })
        }
        else if (this.state.seconds === 1 && this.props.game.currentImage.url !== this.state.previousImage.url) {
            this.setState({ seconds: this.getElapsedTime(), score: this.scoreToShow(), previousImage: this.props.game.currentImage })
        } else {
            this.setState({ seconds: this.getElapsedTime(), score: this.scoreToShow() });
        }
    }


    getElapsedTime() {
        let stoppedAt
        if (this.props.game.stoppedAt === undefined) {
            stoppedAt = new Date().getTime()
        } else {
            stoppedAt = this.props.game.stoppedAt
        }
        if (!this.props.game.startedAt) {
            return 0;
        } else {
            return Math.round((stoppedAt - this.props.game.startedAt) / 1000);
        }
    }

    scoreToShow() {
        let scoreActual = this.props.scoreflash.score
        const durationOfScoreRise = Math.min(30, (scoreActual / 10) + 5)
        if (!this.props.scoreflash.visibility) {
            scoreActual = 0
        }
        let scoreShown = this.props.game.totalScore
        if (this.props.game.scoreflash !== undefined) {
            scoreShown =
                this.props.game.totalScore + Math.min(scoreActual, Math.round(scoreActual * ((new Date().getTime() - this.props.game.scoreflash.startTime) / (50 * durationOfScoreRise))))
        }
        return scoreShown
    }
    /**
     * With the component mounting, the game time measuring tick() is set at 50 milliseconds.
     */
    componentWillMount() {

        this.interval = setInterval(() => this.tick());
    }
    /**
     * At component unmount the interval needs to be cleared.
     */
    componentWillUnmount() {
        clearInterval(this.interval);
    }


    /**
      * Method for rendering the Gameloop page header (containing ProgressBar)
      */
    render() {
        let progressBar = <ProgressBar bsStyle="info" now={0} key={0} />
        let correctAnswers = []
        if (this.props.game.answers !== undefined) {
            correctAnswers = this.props.game.answers.filter(ans => ans.correctness === 100)

            progressBar = this.props.game.answers.map((ans, i) => {
                if (ans.correctness === 100) {
                    return <ProgressBar active bsStyle="success" now={(1 / this.props.game.gameLength) * 100} key={i} />
                } else if (ans.correctness > 70 && ans.correctness < 100) {
                    return <ProgressBar active bsStyle="warning" now={(1 / this.props.game.gameLength) * 100} key={i} />
                } else {
                    return <ProgressBar active bsStyle="danger" now={(1 / this.props.game.gameLength) * 100} key={i} />
                }
            })
        }

        return (
            <div className="score-board">
                <div className="col-md-6 col-md-offset-3 center-block">
                    <h3>{correctAnswers.length}/{this.props.game.gameLength}</h3>
                    <ProgressBar label={`moi`}>
                        {progressBar}
                    </ProgressBar>
                    <h3>SCORE {this.state.score}</h3>
                    <h5>TIME {this.state.seconds}</h5>
                    {this.reminderOfPreviousImage(this.props.progressWidth)}
                </div>
            </div>
        )
    }

    reminderOfPreviousImage(progressWidth) {
        if (this.state.previousImage !== null && this.state.previousImage !== '' && this.props.game.gamemode === 'kirjoituspeli' && this.props.game.endCounter < this.props.game.gameLength) {
            if (this.state.previousImage.bone.nameLatin !== this.props.game.currentImage.bone.nameLatin) {
                var animationActive = false
                if (this.state.seconds >= 2) {
                    animationActive = true
                }

                return (
                    <div>
                        <Animated animationIn="fedeIn" animationOut="fadeOut faster" animationInDelay="100" animationOutDelay="7000" isVisible={animationActive}>

                            <h5>EDELLINEN</h5>
                            <h6>{this.state.previousImage.bone.nameLatin}</h6>
                        </Animated>
                        <div className="intro">
                            <CloudinaryContext cloudName="luupeli">
                                <div className="height-restricted" >
                                    <Animated animat3="fedeIn" animationOut="fadeOut faster" animationInDelaya="100" animationOutDelay="100" isVisible={animationActive}>
                                        <Image id="bone-image" publicId={this.state.previousImage.url}>

                                            <Transformation width="250" height="150" crop="scale" effect="grayscale" />

                                        </Image>
                                    </Animated>
                                </div>
                            </CloudinaryContext>

                        </div>
                    </div>
                )
            }
        }

        return null

    }
}

const mapStateToProps = (state) => {
    return {
        game: state.game,
        scoreflash: state.scoreflash
    }
}

const ConnectedScoreBoard = connect(
    mapStateToProps,
    null
)(ScoreBoard)
export default ConnectedScoreBoard