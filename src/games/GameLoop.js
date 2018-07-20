import { Redirect } from 'react-router-dom'
import React from 'react'
import Message from './Message'
import WritingGame from './WritingGame'
import MultipleChoiceGame from './MultipleChoiceGame'
import { connect } from 'react-redux'
import { gameInitialization, setAnswer } from '../reducers/gameReducer'
import { ProgressBar } from 'react-bootstrap'

class GameLoop extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redirectToEndPage: false,
            style: localStorage.getItem('style'),
            user: null
        };
    }

    componentDidMount() {
        const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            this.setState({ user })
        }
    }

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
                    <div class="container">
                        <div class="row">
                            <div class="col-md-6 col-md-offset-3">
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

    gameLoop() {
        if (this.props.game.endCounter > 0) {
            let noAskedImages
            if (this.props.game.endCounter !== this.props.game.gameLength) {
                noAskedImages = this.props.game.images.filter(img => !this.props.game.answers.some(ans => ans.image.id === img.id))
            } else {
                noAskedImages = this.props.game.images
            }
            console.log(noAskedImages)

            // Nyt tulee vain ei-kysytyistä kuvista ensimmäinen, mutta kuvien valinta randomisti/vaikeuden perusteella.
            // Nyt returnataan ainoastaan WritingGame, mutta tähän if-lause, että jos on valittu monipeli, niin sitten näytetään se.
            if (this.props.game.gamemode == 'kirjoituspeli') {
                return (
                    <WritingGame currentImage={noAskedImages[0]} />
                )
            } else {
                return (
                    <MultipleChoiceGame />
                )
            }
        }
    }

    //If all images have been cycled through, redirect to endscreen, otherwise render quiz page
    render() {
        if (this.props.game.endCounter === 0) {
            setTimeout(function () {
                this.setState({ redirectToEndPage: true })
            }.bind(this), 3000)
            if (this.state.redirectToEndPage) {
                return (
                    <Redirect to={{
                        pathname: "/endscreen"
                    }} />
                )
            }
        }

        return (
            <div className="App">
                {this.topPage()}
                <div class="dual-layout">
                    <div class="container">
                        <div>
                            <Message ref={instance => this.wgmessage = instance} />
                        </div>
                        {this.gameLoop()}
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        game: state.game,
        message: state.message
    }
}

const mapDispatchToProps = {
    gameInitialization,
    setAnswer
}

const ConnectedGameLoop = connect(
    mapStateToProps,
    mapDispatchToProps
)(GameLoop)
export default ConnectedGameLoop