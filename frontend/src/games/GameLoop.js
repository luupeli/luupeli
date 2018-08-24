
import React from 'react'
import WritingGame from './WritingGame'
import MultipleChoiceGame from './MultipleChoiceGame'
import ImageMultipleChoiceGame from './ImageMultipleChoiceGame'
import { connect } from 'react-redux'
import { gameInitialization, setAnswer } from '../reducers/gameReducer'
import { setIntroSound } from '../reducers/soundReducer'

/**
 * Gameloop is the parent component for 'hosting' different game modes of Luupeli.
 * Currently, two different game modes are supported.
 */
class GameLoop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToEndPage: false
        }
    }

    /**
     * Method for rendering selected game mode
     */
    render() {
        if (this.props.game.totalSeconds === '') {
            this.props.setIntroSound()
        }

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
            } else if (this.props.game.gamemode === 'harjoitustentti') {
                return (
                    <WritingGame />
                )
            } else {
                if (this.props.game.surpriseGameMode <= 1) {
                    return <MultipleChoiceGame />
                } else if (this.props.game.surpriseGameMode <= 2) {
                    return <ImageMultipleChoiceGame />
                } else {
                    return <WritingGame />
                }
            }
        } else {
            return null
        }
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

const ConnectedGameLoop = connect(
    mapStateToProps,
    mapDispatchToProps
)(GameLoop)
export default ConnectedGameLoop