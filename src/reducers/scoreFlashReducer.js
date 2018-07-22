const initialState = {
    scoreflash: {
        score: 0,
        scoreflash: '',
        style: ''
    }
}

const scoreFlashReducer = (store = initialState.scoreflash, action) => {
    console.log(action.type)
    if (action.type === 'INIT_SCOREFLASH') {
        console.log(action)
        return { ...store, score: action.score, scoreflash: action.scoreflash, style: action.style }
    }
    if (action.type === 'SET_SCOREFLASH') {
        console.log(action)
        return { ...store, score: action.score, scoreflash: action.scoreflash, style: action.style }
    }
    return store
}

export const setScoreFlash = (score, scoreflash, style, time) => {
    if (time === undefined) {
        time = 5
    }
    if (style === undefined) {
        style = 'primary'
    }

    return async (dispatch) => {
      dispatch(setScoreFlashOn(score, scoreflash, style))
      setTimeout(() => {
        dispatch(scoreFlashInit())
      }, 1000*time)
    }
  }

export const scoreFlashInit = () => {
    return {
        type: 'INIT_SCOREFLASH',
        score: 0,
        scoreflash: '',
        style: ''
    }
}

export const setScoreFlashOn = (score,scoreflash, style) => {
    return {
        type: 'SET_SCOREFLASH',
        score: score,
        scoreflash: scoreflash,
        style: style
    }
}

export default scoreFlashReducer