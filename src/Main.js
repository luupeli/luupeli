import React from 'react'
import { Switch, Route } from 'react-router-dom'
import GameLoop from './games/GameLoop'
import SelectGameMode from './menus/gamescreens/SelectGameMode'
import EndScreen from './menus/gamescreens/EndScreen'
import Home from './menus/Home'
import GameSettings from './menus/gamescreens/GameSettings'
import BoneListing from './menus/admin/BoneListing'
import UserListing from './menus/admin/UserListing'
import User from './menus/admin/User'
import UpdateBone from './menus/admin/UpdateBone'
import Login from './menus/login/Login'
import Register from './menus/login/Register'
import Admin from './menus/admin/Admin'
import Statistics from './menus/admin/Statistics'
import NavBar from './menus/NavBar'
import { BrowserRouter } from 'react-router-dom'
import { init } from './reducers/initializeRecuder'
import { connect } from 'react-redux'

class Main extends React.Component {

  componentDidMount() {
    this.props.init()
  }

  render() {
    return (
      <div>
        {/* <NavBar/> */}
        <main>
          <BrowserRouter>
            <div>
              <Route exact path="/" render={({ location, history }) => {
                return <Home location={location} history={history} />
              }} />
              <Route exact path="/login" render={({ location, history }) => {
                return <Login location={location} history={history} />
              }} />
              <Route exact path="/register" render={({ location, history }) => {
                return <Register location={location} history={history} />
              }} />
              <Route exact path="/gamemode" render={({ location, history }) => {
                return <SelectGameMode location={location} history={history} />
              }} />
              <Route exact path="/game" render={({ location, history }) => {
                return <GameLoop location={location} history={history} />
              }} />
              <Route exact path="/settings" render={({ location, history }) => {
                return <GameSettings location={location} history={history} />
              }} />
              <Route exact path="/endscreen" render={({ location, history }) => {
                return <EndScreen location={location} history={history} />
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
            </div>
          </BrowserRouter>
        </main>
      </div>
    )
  }
}

const mapDispatchToProps = {
  init
}

const ConnectedMain = connect(
  null,
  mapDispatchToProps
)(Main)
export default ConnectedMain