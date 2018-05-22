import React from 'react'
import { Switch, Route } from 'react-router-dom'
import WritingGame from './WritingGame'
import Home from './Home'

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/writinggame' component={WritingGame}/>
    </Switch>
  </main>
)

export default Main
