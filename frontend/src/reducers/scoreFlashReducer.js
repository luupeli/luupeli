import setScoreFlashSound from './soundReducer'

const initialState = {
    scoreflash: {
        score: 0,
        streak: '1x',
        streakemoji: '',
        scoreflash: '',
        style: '',
        visibility: false,
        startPlayingBonusSound: false,
        startTime: new Date().getTime()
    }
}

const scoreFlashReducer = (store = initialState.scoreflash, action) => {
    //  console.log(action.type)
    if (action.type === 'SET_SCOREFLASH_ON') {
        console.log(action)
        return { ...store, score: action.score, streak: action.streak, streakemoji: action.streakemoji, scoreflash: action.scoreflash, style: action.style, visibility: action.visibility, startTime: action.startTime,startPlayingBonusSound: action.startPlayingBonusSound }
    }
    if (action.type === 'SET_SCOREFLASH_OFF') {
        console.log(action)
        return { ...store, score: action.score, style: action.style, visibility: action.visibility, startPlayingBonusSound: action.startPlayingBonusSound }
    }
    if (action.type === 'SET_STOP_SOUND') {
        console.log(action)
        return { ...store, startPlayingBonusSound: action.startPlayingBonusSound }
    }
    return store
}



export const setScoreFlash = (score, streak, streakemoji, scoreflash, style, time, visibility) => {
    if (time === undefined || time === 'nan') {
        time = 2.5
    }
    if (score === undefined || score === 'nan') {
        score = scoreflash.score
    }
    if (streak === undefined || score === 'nan') {
        streak = scoreflash.streak
    }
    if (streakemoji === undefined || score === 'nan') {
        streakemoji = scoreflash.streakemoji
    }

    if (scoreflash === undefined || scoreflash === 'nan') {
        scoreflash = scoreflash.scoreflash
    }
    if (style === undefined || style === 'nan') {
        style = 'primary'
    }
    if (visibility === undefined || visibility === 'nan') {
        visibility = true
    }
    

    return async (dispatch, getState) => {
        dispatch(setScoreFlashOn(score, streak, streakemoji, scoreflash, style, visibility))
        setTimeout(() => {
            dispatch(setScoreFlashOff())
        }, time * 1000)

    }
}

export const setScoreFlashOn = (score, streak, streakemoji, scoreflash, style, visibility) => {

    return {
        type: 'SET_SCOREFLASH_ON',
        score: score,
        streak: streak,
        streakemoji: streakemoji,
        scoreflash: scoreflash,
        style: style,
        visibility: visibility,
        startPlayingBonusSound: true,
        startTime: new Date().getTime()
    }
}

export const setScoreFlashOff = () => {

    return {
        type: 'SET_SCOREFLASH_OFF',
        score: '',
        scoreflash: undefined,
        style: 'primary',
        visibility: false,
        startPlayingBonusSound: false,
    }
}

export const stopPlayingBonusSound = () => {

    return {
        type: 'SET_STOP_SOUND',
        startPlayingBonusSound: false
    }
}

export default scoreFlashReducer