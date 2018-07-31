const initialState = {
    scoreflash: {
        score: 0,
        streak:'1x',
        streakemoji: '',
        scoreflash: '',
        style: '',
        visibility: true
    }
}

const scoreFlashReducer = (store = initialState.scoreflash, action) => {
  //  console.log(action.type)
    if (action.type === 'INIT_SCOREFLASH') {
        console.log(action)
        return { ...store, score: action.score, streak:action.streak,  streakemoji:action.streakemoji,scoreflash: action.scoreflash, style: action.style,visibility: action.visibility }
    }
    if (action.type === 'SET_SCOREFLASH') {
        console.log(action)
        return { ...store, score: action.score, streak:action.streak, streakemoji:action.streakemoji,scoreflash: action.scoreflash, style: action.style, visibility: action.visibility }
    }

    return store
}



export const setScoreFlash = (score, streak,streakemoji, scoreflash, style, time, visibility) => {
    

    if (time === undefined || time==='nan') {
        time = 3
    }
    if (score === undefined || score==='nan') {
        score=scoreflash.score
    }
    if (streak === undefined || score==='nan') {
        streak=scoreflash.streak
    }
    if (streakemoji === undefined || score==='nan') {
        streakemoji=scoreflash.streakemoji
    }
    
    if (scoreflash === undefined || scoreflash==='nan') {
        scoreflash=scoreflash.scoreflash
    }
    if (style === undefined || style==='nan') {
        style = 'primary'
    }
    if (visibility === undefined || visibility==='nan') {
        visibility = true
    }

    return async (dispatch) => {
      dispatch(setScoreFlashOn(score,streak,streakemoji,scoreflash, style,visibility))
      setTimeout(() => {
        dispatch(setScoreFlashOn(score,streak,streakemoji, scoreflash,style,false))
      }, 2000)

    }
  }



export const scoreFlashInit = () => {
    return {
        type: 'INIT_SCOREFLASH',
        score: 0,
        streak: '1x',
        streakEmoji: '',
        scoreflash: '',
        style: '',
        visibility: true
    }
}

export const setScoreFlashOn = (score,streak,streakemoji,scoreflash, style, visibility) => {
    
    return {
        type: 'SET_SCOREFLASH',
        score: score,
        streak: streak,
        streakemoji: streakemoji,
        scoreflash: scoreflash,
        style: style,
        visibility: visibility
    }
}


export default scoreFlashReducer