import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import gameReducer from './reducers/gameReducer'
import messageReducer from './reducers/messageReducer'
import scoreFlashReducer from './reducers/scoreFlashReducer'
import initializeReducer from './reducers/initializeRecuder'
import soundReducer from './reducers/soundReducer'


const reducer = combineReducers({
  game: gameReducer,
  message: messageReducer,
  scoreflash: scoreFlashReducer,
  init: initializeReducer,
  sound: soundReducer
})

const store = createStore(
    reducer,
    composeWithDevTools(
      applyMiddleware(thunk)
    )
  )  

export default store
