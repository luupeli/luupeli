import React from 'react'
import { Switch, Route } from 'react-router-dom'
import GameLoop from './games/GameLoop'
import SelectGameMode from './menus/SelectGameMode'
import EndScreen from './menus/EndScreen'
import Home from './menus/Home'
import GameSettings from './menus/GameSettings'
import BoneListing from './menus/BoneListing'
import UserListing from './menus/UserListing'
import AddData from './menus/AddData'
import User from './menus/User'
import UpdateBone from './menus/UpdateBone'
import Login from './menus/Login'
import Register from './menus/Register'
import Admin from './menus/Admin'
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
              <Route exact path="/add_data" render={({ location, history }) => {
                return <AddData location={location} history={history} />
              }} />
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