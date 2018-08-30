import React from 'react'
import { Route } from 'react-router-dom'
import Game from './games/Game'
import SelectGameMode from './menus/gamescreens/SelectGameMode'
import EndScreen from './menus/gamescreens/EndScreen'
import Home from './menus/Home'
import Leaderboard from './menus/Leaderboard'
import Sounds from './Sounds'
import GameSettings from './menus/gamescreens/GameSettings'
import WritingGame from './games/WritingGame'
import BoneListing from './menus/admin/BoneListing'
import UserListing from './menus/admin/UserListing'
import User from './menus/admin/User'
import UpdateBone from './menus/admin/UpdateBone'
import Login from './menus/login/Login'
import Register from './menus/login/Register'
import Admin from './menus/admin/Admin'
import Statistics from './menus/admin/Statistics'
import AddData from './menus/AddData'
import { BrowserRouter } from 'react-router-dom'
import { init } from './reducers/initializeRecuder'
import { connect } from 'react-redux'

class Main extends React.Component {

  componentDidMount() {
    this.props.init()
  }

  render() {
    const sound = () => {
      if (this.props.sound.active && this.props.game.playSound) {
        return (
          <Sounds />
        )
      }
    }

    return (
      <div>
        <main>
          <BrowserRouter>
            <div>
              {sound()}
              <Route exact path="/" render={({ location, history }) => {
                return <Home location={location} history={history} />
              }} />
              <Route exact path="/add_data" render={({ location, history }) => {
                return <AddData location={location} history={history} />
              }} />
              <Route exact path="/login" render={({ location, history }) => {
                return <Login location={location} history={history} />
              }} />
              <Route exact path="/register" render={({ location, history }) => {
                return <Register location={location} history={history} />
              }} />
              <Route exact path="/listing" render={({ location, history }) => {
                return <BoneListing location={location} history={history} />
              }} />
              <Route exact path="/users" render={({ location, history }) => {
                return <UserListing location={location} history={history} />
              }} />
              <Route exact path='/users/:userId' render={({ match, location, history }) => {
                return <User location={location} history={history} userId={match.params.userId} />
              }} />
              <Route exact path="/add" render={({ location, history }) => {
                return <UpdateBone location={location} history={history} />
              }} />
              <Route exact path='/update/:boneId' render={({ match, location, history }) => {
                return <UpdateBone location={location} history={history} boneId={match.params.boneId} />
              }} />
              <Route exact path="/admin" render={({ location, history }) => {
                return <Admin location={location} history={history} />
              }} />
              <Route exact path="/statistics" render={({ location, history }) => {
                return <Statistics location={location} history={history} />
              }} />
              <Route exact path="/leaderboard" render={({ location, history }) => {
                return <Leaderboard location={location} history={history} />
              }} />
              <Route exact path="/exam" render={({ location, history }) => {
                return <WritingGame location={location} history={history} />
              }} />
              <Route path="/play" render={({ location, history }) => {
                console.log(location)
                console.log(history)
                if (history.location.state.mode === 'settings') {
                  return <GameSettings location={location} history={history} />
                } else if (history.location.state.mode === 'gamemode') {
                  return <SelectGameMode location={location} history={history} />
                } else if (history.location.state.mode === 'game') {
                  return <Game location={location} history={history} />
                } else if (history.location.state.mode === 'endscreen') {
                  return <EndScreen location={location} history={history} />
                }
              }} />
            </div>
          </BrowserRouter>
        </main>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    game: state.game,
    sound: state.sound
  }
}

const mapDispatchToProps = {
  init
}

const ConnectedMain = connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)
export default ConnectedMain