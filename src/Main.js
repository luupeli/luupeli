import React from 'react'
import { Switch, Route } from 'react-router-dom'
import GameLoop from './games/GameLoop'
import SelectGameMode from './menus/SelectGameMode'
import EndScreen from './menus/EndScreen'
import Home from './menus/Home'
import GameSettings from './menus/GameSettings'
import BoneListing from './menus/BoneListing'
import UserListing from './menus/UserListing'
import AddBone from './menus/AddBone'
import UpdateBone from './menus/UpdateBone'
import Login from './menus/Login'
import Register from './menus/Register'
import Admin from './menus/Admin'
import NavBar from './menus/NavBar'
import { BrowserRouter } from 'react-router-dom'

const Main = () => (
  <div>
    <NavBar/>
    <main>
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/gamemode' component={SelectGameMode} />
        <Route exact path='/game' component={GameLoop} />
        <Route exact path='/settings' component={GameSettings} />
        <Route exact path='/endscreen' component={EndScreen} />
        <Route exact path='/listing' component={BoneListing} />
        <Route exact path='/users' component={UserListing} />
        <Route exact path='/add' component={AddBone} />
        <Route exact path='/update/:boneId' component={UpdateBone} />
        <Route exact path='/admin' component={Admin} />
      </Switch>
      </BrowserRouter>
    </main>
  </div>
)

export default Main