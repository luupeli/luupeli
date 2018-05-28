import React from 'react'
import { Switch, Route } from 'react-router-dom'
import WritingGame from './games/writinggame/WritingGame'
import SelectGameMode from './menus/SelectGameMode'
import EndScreen from './menus/EndScreen'
import Home from './menus/Home'
import GameSettings from './menus/GameSettings'

const Main = () => (
  <div>
    <main>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/game' component={SelectGameMode} />
        <Route exact path='/writinggame' component={WritingGame} />
        <Route exact path='/settings' component={GameSettings} />
        <Route exact path='/endscreen' component={EndScreen} />
      </Switch>
    </main>
  </div>
)

export default Main
