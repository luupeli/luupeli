const initialState = {
    game: {
        user: '',
        gamemode: '',
        gameLength: '',
        endCounter: '',
        images: [],
        answers: []
    }
}

const gameReducer = (store = initialState.game, action) => {
    console.log(action.type)
    if (action.type === 'INIT_GAME') {
        console.log(action)
        return { ...store, user: action.user, gameLength: action.gameLength, endCounter: action.endCounter, images: action.images, answers: action.answer, gamemode: action.gamemode }
    }
    if (action.type === 'SET_ANSWER') {
        console.log(action)
        if (store.answers === undefined) {
            return { ...store, answers: action.answer, endCounter: store.endCounter - 1 }
        } else {
            return { ...store, answers: store.answers.concat(action.answer), endCounter: store.endCounter - 1 }
        }
    }
    return store
}

export const gameInitialization = (gameLength, images, user, gamemode) => {
    console.log(images)
    console.log(gameLength)
    return {
        type: 'INIT_GAME',
        gameLength: gameLength,
        endCounter: gameLength,
        images: images,
        answers: [],
        gamemode: gamemode,
        user: user
    }
}

export const setAnswer = (image, correctness, answer) => {
    return {
        type: 'SET_ANSWER',
        answer: [{
            image: image,
            correctness: correctness,
            answer: answer
        }],
    }
}

export default gameReducer