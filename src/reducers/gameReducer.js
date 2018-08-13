const initialState = {
    game: {
        user: '',
        surpriseGameMode: '',
        gamemode: '',
        gameLength: '',
        endCounter: 1,
        currentImage: '',
        wrongAnswerOptions: [],
        wrongImageOptions: [],
        images: [],
        answers: undefined,
        totalSeconds: '',
        gameClock: 0,
        playSound: false,
        gameDifficulty: "medium",
        startTime: ''
    }
}

const gameReducer = (store = initialState.game, action) => {
    if (action.type === 'INIT_GAME') {
        console.log(action)
        return { ...store, surpriseGameMode: action.surpriseGameMode, wrongImageOptions: action.wrongImageOptions, 
              wrongAnswerOptions: action.wrongAnswerOptions, currentImage: action.currentImage, user: action.user,
               totalScore: action.totalScore, gameLength: action.gameLength, endCounter: action.endCounter, 
               totalSeconds: action.totalSeconds, images: action.images, animals: action.animals, 
               bodyparts: action.bodyparts, answers: action.answer, gamemode: action.gamemode,playSound: action.playSound,gameDifficulty: action.gameDifficulty, startTime: action.startTime,getGameClock: action.getGameClock }
    }
    if (action.type === 'SET_ANSWER') {
        console.log(action)
        if (store.answers === undefined) {
            return { ...store, surpriseGameMode: action.surpriseGameMode, answers: action.answer, endCounter: store.endCounter - 1, gameClock: 0,totalSeconds: action.totalSeconds, totalScore: action.totalScore }
        } else {
            return { ...store, surpriseGameMode: action.surpriseGameMode,answers: store.answers.concat(action.answer), endCounter: store.endCounter - 1, gameClock: 0,  totalSeconds: store.totalSeconds + action.totalSeconds, totalScore: store.totalScore + action.totalScore }
        }
    }
    if (action.type === 'SET_IMAGE_TO_ASK') {
        console.log(action)
        return { ...store, currentImage: action.currentImage }
    }
    if (action.type === 'SET_WRONG_ANSWER_OPTIONS') {
        console.log(action)
        return { ...store, wrongAnswerOptions: action.wrongAnswerOptions, currentImage: action.currentImage }
    }
    if (action.type === 'SET_WRONG_IMAGE_OPTIONS') {
        console.log(action)
        return { ...store, wrongImageOptions: action.wrongImageOptions, currentImage: action.currentImage }
    }
    if (action.type === 'ADVANCE_GAMECLOCK') {
        
        return { ...store, gameClock: store.gameClock+1 }
    }
    if (action.type === 'TOGGLE_SOUND') {

        return { ...store, playSound: store.playSound + 1 }
    }
     if (action.type === 'RESET_GAMECLOCK') {
         return {...store, startTime: (new Date()).getTime()}
         
    }
    return store
}


export const gameInitialization = (gameLength, images, user, gamemode, animals, bodyparts, playSound, gameDifficulty) => {
    const imageToAsk = selectNextImage(undefined, images);
    const wrongAnswerOptions = selectWrongAnswerOptions(images, imageToAsk)
    const wrongImageOptions = selectWrongImageOptions(images, imageToAsk)
    

    console.log(images)
    console.log(gameLength)
    console.log(animals)
    console.log(bodyparts)

    var startTime = (new Date()).getTime();
    console.log('time:' +startTime)
    return {
        type: 'INIT_GAME',
        gameLength: gameLength,
        endCounter: gameLength,
        currentImage: imageToAsk,
        wrongAnswerOptions: wrongAnswerOptions,
        wrongImageOptions: wrongImageOptions,
        surpriseGameMode: Math.floor(Math.random() * 4),
        images: images,
        animals: animals,
        bodyparts: bodyparts,
        answers: undefined,
        gamemode: gamemode,
        user: user,
        totalSeconds: 0,
        totalScore: 0,
        gameClock:0,
        playSound:playSound,
        gameDifficulty: gameDifficulty,
        startTime: startTime,
    }
}

// This sets a new answer to the answers array.
export const setAnswer = (image, correctness, answer, seconds, score) => {
    return {
        type: 'SET_ANSWER',
        answer: [{
            image: image,
            correctness: correctness,
            answer: answer,
            seconds: seconds,
            score: score
        }],
        totalSeconds: seconds,
        totalScore: score,
        surpriseGameMode: Math.floor(Math.random() * 4)
    }
}

// When the previous question is answered, this call will choose the image for the next question.
export const setImageToAsk = (images, answers) => {
    
    const imageToAsk = selectNextImage(answers, images);
    console.log(answers + '!!!')
    return {
        type: 'SET_IMAGE_TO_ASK',
        currentImage: imageToAsk
    }
}

// When the previous question is answered, this call will choose incorrect answer options for multiple choice game mode (MultipleChoiceGame).
export const setWrongAnswerOptions = (images, answers) => {
    const imageToAsk = selectNextImage(answers, images);
    const wrongAnswerOptions = selectWrongAnswerOptions(images, imageToAsk);
    return {
        type: 'SET_WRONG_ANSWER_OPTIONS',
        wrongAnswerOptions: wrongAnswerOptions,
        currentImage: imageToAsk
    }
}

// When the previous question is answered, this call will choose incorrect image options for multiple choice game mode (ImageMultipleChoiceGame).
export const setWrongImageOptions = (images, answers) => {
    const imageToAsk = selectNextImage(answers, images);
    const wrongImageOptions = selectWrongImageOptions(images, imageToAsk);
    return {
        type: 'SET_WRONG_IMAGE_OPTIONS',
        wrongImageOptions: wrongImageOptions,
        currentImage: imageToAsk
    }
}



export const advanceGameClock = () => {
    return {
        type: 'ADVANCE_GAMECLOCK'
    }
}

export const getGameClock = () => {
    return {
        type: 'GET_GAMECLOCK'
    }
      

}

export const resetGameClock = () => {
    return {
        type: 'RESET_GAMECLOCK'
    }
}

export const toggleSound = () => {
    return {
        type: 'TOGGLE_SOUND'
    }
}



export default gameReducer

/** This method defines the wrong answer options. We only use the bones that match the game settings. 
 * The bones are chosen randomly. If there are too few bones, the answer options will be less than three.
 * The correct answer can not be among the wrong answers.
*/
function selectWrongAnswerOptions(images, currentImage) {
    let allLatinNames = images.map(img => img.bone.nameLatin);
    allLatinNames = Array.from(new Set(allLatinNames));
    allLatinNames = allLatinNames.filter(answer => answer !== currentImage.bone.nameLatin);
    let selectedAnswers = [];
    const numberOfButtons = Math.min(3, allLatinNames.length);
    while (selectedAnswers.length < numberOfButtons) {
        const index = Math.floor(Math.random() * allLatinNames.length);
        selectedAnswers.push(allLatinNames[index]);
        allLatinNames.splice(index, 1);
    }

    selectedAnswers = selectedAnswers.map(ans => {
        return ({
            nameLatin: ans, correct: false
        })
    })
    const correctAns = { nameLatin: currentImage.bone.nameLatin, correct: true }
    selectedAnswers.push(correctAns)

    var shuffle = require('shuffle-array')
    shuffle(selectedAnswers)
    console.log(correctAns)
    console.log(selectedAnswers)
    return selectedAnswers;
}



/** This method defines the wrong image options. We only use the images that match the game settings. 
 * The images are chosen randomly. If there are too few images, the image options will be less than three.
 * The correct answer can not be among the wrong answers.
*/
function selectWrongImageOptions(images, currentImage) {
    const allImages = images.filter(img => !((img.animal === currentImage.animal) && (img.bone === currentImage.bone)));
    let selectedImages = [];
    const numberOfImages = Math.min(3, allImages.length);
    while (selectedImages.length < numberOfImages) {
        const index = Math.floor(Math.random() * allImages.length);
        selectedImages.push(allImages[index]);
        allImages.splice(index, 1);
    }
    selectedImages = selectedImages.map(image => {
        return ({
            ...image, correct: false
        })
    })
    const correctImg = { ...currentImage, correct: true }
    selectedImages.push(correctImg)

    var shuffle = require('shuffle-array')
    shuffle(selectedImages)
    console.log(correctImg)
    console.log(selectedImages)
    return selectedImages;
}

/**
This method chooses an image for the next question. I think this is not ready yet. 
We first use all the images that have not yet been asked. 
Then we use those images that correctness is less than correctness average. The images are chosen randomly.
 */
function selectNextImage(answers, images) {
    let noAskedImages;
    if (answers !== undefined) {
        noAskedImages = images.filter(img => !answers.some(ans => ans.image.id === img.id));
    }
    else {
        noAskedImages = images;
    }
    console.log(noAskedImages);

    let imageToAsk
    if (noAskedImages.length > 0) {
        imageToAsk = noAskedImages[Math.floor(Math.random() * noAskedImages.length)];
    } else {
        let values = answers.map(ans => ans.correctness)
        let count = values.length
        values = values.reduce((previous, current) => current += previous)
        values /= count
        let haveToLearn = answers.filter(ans => ans.correctness <= values)
        haveToLearn = haveToLearn.map(ans => ans.image)
        imageToAsk = haveToLearn[Math.floor(Math.random() * haveToLearn.length)]
    }
    return imageToAsk;
}
