import { Redirect } from 'react-router-dom'
import React from 'react'
import Message from './Message'
import ScoreFlash from './ScoreFlash'
import WritingGame from './WritingGame'
import MultipleChoiceGame from './MultipleChoiceGame'
import ImageMultipleChoiceGame from './ImageMultipleChoiceGame'
import { connect } from 'react-redux'
import { gameInitialization, setAnswer } from '../reducers/gameReducer'
import { ProgressBar } from 'react-bootstrap'
import gameSessionService from '../services/gameSessions'
import bodyPartService from '../services/bodyParts'
import animalService from '../services/animals'


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
        allAnimals: [],
        allBodyParts: []
      };
      this.postGameSession = this.postGameSession.bind(this)
    }

    componentDidMount() {
      const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        this.setState({ user })
      }
      animalService.getAll()
        .then(response => {
          console.log(response)
          console.log(response.data)
          this.setState({allAnimals : response.data})
      })

      bodyPartService.getAll()
        .then(response => {
          this.setState({allBodyParts : response.data})
      })
    }

    postGameSession() {

      let animalsPosted = []
      let bodyPartsPosted = []

      let faultyAnimals = this.props.game.animals
      let faultyBodyParts = this.props.game.bodyparts
      console.log (faultyAnimals)

      // allAnimals.forEach(function(animal) {
      //   this.props.game.animals.forEach(function(animal2) {
      //     if (animal.id === animal2.id) {
      //       animalsPosted.push(animal)
      //     }
      //   })
      // })

      // allBodyParts.forEach(function(bodyPart) {
      //   this.props.game.bodyparts.forEach(function(bodyPart2) {
      //     console.log(bodyPart)
      //     if (bodyPart.id === bodyPart2.id) {
      //       bodyPartsPosted.push(bodyPart)
      //     }
      //   })
      // })

      for (let animal of this.state.allAnimals) {
        for (let animal2 of faultyAnimals) {
          if (animal.id === animal2.id) {
            animalsPosted.push(animal)
          }
        }
      }

      for (let bodyPart of this.state.allBodyParts) {
        for (let bodyPart2 of faultyBodyParts) {
          console.log(bodyPart)
          console.log(bodyPart2)
          if (bodyPart.id === bodyPart2.id) {
            bodyPartsPosted.push(bodyPart)
          }
        }
      }

      console.log(animalsPosted)
      console.log(bodyPartsPosted)
    
      gameSessionService.create({
        user: this.state.user.username,
        mode: this.props.game.gamemode,
        length: this.props.game.gameLength,
        difficulty: this.props.game.difficulty,
        animals: animalsPosted,
        bodyparts: bodyPartsPosted,
        correctAnswerCount: this.props.game.answers.filter(ans => ans.correctness === 100).length,
        almostCorrectAnswerCount: this.props.game.answers.filter(ans => ans.correctness > 70 && ans.correctness < 100).length
      })
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
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

    /**
     * Method for rendering selected game mode
     */
    gameLoop() {
        if (this.props.game.endCounter > 0) {
            if (this.props.game.gamemode == 'kirjoituspeli') {
                return (
                    <WritingGame />
                )
            } else if (this.props.game.gamemode == 'monivalintapeli') {
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
        if (this.props.game.endCounter === 0) {
            setTimeout(function () {
                this.setState({ redirectToEndPage: true })
            }.bind(this), 3000)
            if (this.state.redirectToEndPage) {
              if (this.state.user !== null) {
                this.postGameSession()
              }
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
                            <ScoreFlash ref={instance => this.wgmessage = instance} />
                        </div>
                        <div>
                            <Message />
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
        message: state.message,
        scoreflash: state.scoreflash
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