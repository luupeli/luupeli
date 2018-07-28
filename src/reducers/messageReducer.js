const initialState = {
    message: {
        text: '',
        style: ''
    }
}

const messageReducer = (store = initialState.message, action) => {
//    console.log(action.type)
    if (action.type === 'INIT_MESSAGE') {
        console.log(action)
        return { ...store, text: action.message, style: action.style }
    }
    if (action.type === 'SET_MESSAGE') {
        console.log(action)
        return { ...store, text: action.message, style: action.style }
    }
    return store
}

export const setMessage = (message, style, time) => {
    if (time === undefined) {
        time = 5
    }
    if (style === undefined) {
        style = 'primary'
    }

    return async (dispatch) => {
      dispatch(setMessageOn(message, style))
      setTimeout(() => {
        dispatch(messageInit())
      }, 1000*time)
    }
  }

export const messageInit = () => {
    return {
        type: 'INIT_MESSAGE',
        message: '',
        style: ''
    }
}

export const setMessageOn = (message, style) => {
    return {
        type: 'SET_MESSAGE',
        message: message,
        style: style
    }
}

export default messageReducer