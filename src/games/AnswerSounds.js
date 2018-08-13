import React from 'react'
import Sound from 'react-sound'
import { connect } from 'react-redux'

class AnswerSounds extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            playStatus: true
        }
    }

    componentDidMount() {
        if (this.props.correctness !== undefined) {
            setTimeout(() => {
                this.setState({ playStatus: false })
            }, this.props.correctness > 99 ? 1500 : 500)
        }
    }

    render() {
        if (this.props.correctness !== undefined) {
            if (this.props.game.playSound) {
                console.log(this.props.correctness)
                if (this.props.correctness > 99) {
                    return (
                        <Sound
                            url="/sounds/391540__mativve__electro-success-sound.wav"
                            playStatus={this.state.playStatus === true ? Sound.status.PLAYING : Sound.status.STOP}
                        />
                    )
                } else {
                    return (
                        <Sound
                            url="/sounds/142608__autistic-lucario__error.wav"
                            playStatus={this.state.playStatus === true ? Sound.status.PLAYING : Sound.status.STOP}
                        />
                    )
                }
            }
        } else {
            return (
                <div></div>
            )
        }
    }
 }

const mapStateToProps = (state) => {
    return {
        game: state.game,
    }
}

const ConnectedAnswerSounds = connect(
    mapStateToProps,
    null
)(AnswerSounds)
export default ConnectedAnswerSounds