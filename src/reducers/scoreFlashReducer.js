const initialState = {
    scoreflash: {
        score: 0,
        scoreflash: '',
        style: '',
        visibility: true
    }
}

const scoreFlashReducer = (store = initialState.scoreflash, action) => {
    console.log(action.type)
    if (action.type === 'INIT_SCOREFLASH') {
        console.log(action)
        return { ...store, score: action.score, scoreflash: action.scoreflash, style: action.style,visibility: action.visibility }
    }
    if (action.type === 'SET_SCOREFLASH') {
        console.log(action)
        return { ...store, score: action.score, scoreflash: action.scoreflash, style: action.style, visibility: action.visibility }
    }

    return store
}



export const setScoreFlash = (score, scoreflash, style, time, visibility) => {
    if (time === undefined) {
        time = 3
    }
    if (style === undefined) {
        style = 'primary'
    }
    if (visibility === undefined) {
        visibility = true
    }

    return async (dispatch) => {
      dispatch(setScoreFlashOn(score, scoreflash, style,visibility))
      setTimeout(() => {
        dispatch(scoreFlashInit())
      }, 1000*time)
    }
  }

//   export const makeScoreFlashInvisible = () => {
//     return {
//         type: 'INVISIBLE_SCOREFLASH',
//         visibility: false
        
//     }
// }

export const scoreFlashInit = () => {
    return {
        type: 'INIT_SCOREFLASH',
        score: 0,
        scoreflash: '',
        style: '',
        visibility: true
    }
}

export const setScoreFlashOn = (score,scoreflash, style, visibility) => {
    
    return {
        type: 'SET_SCOREFLASH',
        score: score,
        scoreflash: scoreflash,
        style: style,
        visibility: visibility
    }
}

export default scoreFlashReducer