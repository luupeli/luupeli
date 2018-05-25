import React from 'react'
import { Switch, Route } from 'react-router-dom'
import WritingGame from './WritingGame'
import SelectGameMode from './menus/SelectGameMode'
import Home from './menus/Home'

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/game' component={SelectGameMode} />
      <Route exact path='/writinggame' component={WritingGame} />
    </Switch>
  </main>
)

export default Main
