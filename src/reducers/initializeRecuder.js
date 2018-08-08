import animalService from '../services/animals'
import bodyPartService from '../services/bodyParts'

const initialState = {
    init: {
        bodyParts: [],
        animals: []
    }
}

const initializeReducer = (store = initialState.init, action) => {
    if (action.type === 'INIT') {
        console.log(action)
        return { ...store, animals: action.animals, bodyParts: action.bodyParts }
    }
    return store
}

export const init = () => {
    return async (dispatch) => {
        const animals = await animalService.getAll()
        const bodyParts = await bodyPartService.getAll()

        dispatch({
          type: 'INIT',
          bodyParts: bodyParts.data,
          animals: animals.data
        })
      }
}

export default initializeReducer