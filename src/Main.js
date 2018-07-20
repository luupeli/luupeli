import React from 'react'
import { Switch, Route } from 'react-router-dom'
import WritingGame from './games/writinggame/WritingGame'
import SelectGameMode from './menus/SelectGameMode'
import EndScreen from './menus/EndScreen'
import Home from './menus/Home'
import GameSettings from './menus/GameSettings'
import BoneListing from './menus/BoneListing'
import AddBone from './menus/AddBone'
import UpdateBone from './menus/UpdateBone'
import Login from './menus/Login'
import Register from './menus/Register'
import Admin from './menus/Admin'
import NavBar from './menus/NavBar'

const Main = () => (
  <div>
    <NavBar/>
    <main>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/game' component={SelectGameMode} />
        <Route exact path='/game' component={GameLoop} />
        <Route exact path='/settings' component={GameSettings} />
        <Route exact path='/endscreen' component={EndScreen} />
        <Route exact path='/listing' component={BoneListing} />
        <Route exact path='/add' component={AddBone} />
        <Route exact path='/update/:boneId' component={UpdateBone} />
        <Route exact path='/admin' component={Admin} />
      </Switch>
    </main>
  </div>
)

export default Main