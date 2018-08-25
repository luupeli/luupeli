import React from 'react';
import Sound from 'react-sound';
import { connect } from 'react-redux'
import { setSoundOff } from './reducers/soundReducer'

class Sounds extends React.Component {
    constructor(props) {
        super(props);
        this.handleSongFinishedPlaying = this.handleSongFinishedPlaying.bind(this)
    };

    handleSongFinishedPlaying() {
        this.props.setSoundOff()
    }

    render() {
        return (
            <Sound
                url={this.props.sound.url}
                playStatus={Sound.status.PLAYING}
                onFinishedPlaying={this.handleSongFinishedPlaying}
            />
        )
    }

}

const mapStateToProps = (state) => {
    return {
        sound: state.sound
    }
}

const mapDispatchToProps = {
    setSoundOff
}

const ConnectedSound = connect(
    mapStateToProps,
    mapDispatchToProps
)(Sounds)
export default ConnectedSound