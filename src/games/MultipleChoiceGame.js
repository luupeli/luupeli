import React from 'react'
import { gameInitialization, setAnswer } from '../reducers/gameReducer'
import { setMessage } from '../reducers/messageReducer'
import { connect } from 'react-redux'

class MultipleChoiceGame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
  }

  render() {
    return (
      <div class="bottom">

        <div class="container">
        <div class="row">
          <div><p>Vaihtoehtoinen pelimuoto, valmistuu ensi viikolla</p></div>
        </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    game: state.game
  }
}

const mapDispatchToProps = {
  gameInitialization,
  setAnswer,
  setMessage
}

const ConnectedMultipleChoiceGame = connect(
  mapStateToProps,
  mapDispatchToProps
)(MultipleChoiceGame)
export default ConnectedMultipleChoiceGame
