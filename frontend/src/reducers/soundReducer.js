const initialState = {
    sound: {
        url: undefined,
        active: false,
    }
}

const soundReducer = (store = initialState.sound, action) => {
    //  console.log(action.type)
    if (action.type === 'SET_SOUND_ON') {
        console.log(action)
        return { ...store, url: action.url, active: true }
    }
    if (action.type === 'SET_SOUND_OFF') {
        console.log(action)
        return { ...store, active: false }
    }

    return store
}

/**
 * Removed success sound for better mobile performance
 */
export const setAnswerSound = (correctness) => {
    let url
    // if (correctness > 99) {
    //     url = "/sounds/391540__mativve__electro-success-sound.wav"
    // } else {
        if (correctness < 70) {
        url = "/sounds/142608__autistic-lucario__error.wav"
    }

    return async (dispatch) => {
        dispatch(setSoundOn(url))
    }
}

export const setIntroSound = () => {
    return async (dispatch) => {
        dispatch(setSoundOn("/sounds/393385__fred1712__chiptune-intro-1.wav"))
    }
}

export const setSoundOn = (url) => {
    return {
        type: 'SET_SOUND_ON',
        url: url
    }
}

export const setSoundOff = () => {

    return {
        type: 'SET_SOUND_OFF'
    }
}

export default soundReducer