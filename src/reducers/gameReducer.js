const initialState = {
    game: {
        user: '',
        surpriseGameMode: '',
        gamemode: '',
        gameLength: '',
        endCounter: '',
        currentImage: '',
        wrongAnswerOptions: [],
        wrongImageOptions: [],
        images: [],
        answers: [],
        totalSeconds: ''
    }
}

const gameReducer = (store = initialState.game, action) => {
    console.log(action.type)
    if (action.type === 'INIT_GAME') {
        console.log(action)
        return { ...store, surpriseGameMode: action.surpriseGameMode, wrongImageOptions: action.wrongImageOptions, wrongAnswerOptions: action.wrongAnswerOptions, currentImage: action.currentImage, user: action.user, totalScore: action.totalScore, gameLength: action.gameLength, endCounter: action.endCounter, totalSeconds: action.totalSeconds, images: action.images, answers: action.answer, gamemode: action.gamemode }
    }
    if (action.type === 'SET_ANSWER') {
        console.log(action)
        if (store.answers === undefined) {
            return { ...store, surpriseGameMode: action.surpriseGameMode, answers: action.answer, endCounter: store.endCounter - 1, totalSeconds: action.totalSeconds, totalScore: action.totalScore }
        } else {
            return { ...store, surpriseGameMode: action.surpriseGameMode,answers: store.answers.concat(action.answer), endCounter: store.endCounter - 1, totalSeconds: store.totalSeconds + action.totalSeconds, totalScore: store.totalScore + action.totalScore }
        }
    }
    if (action.type === 'SET_IMAGE_TO_ASK') {
        console.log(action)
        return { ...store, currentImage: action.currentImage }
    }
    if (action.type === 'SET_WRONG_ANSWER_OPTIONS') {
        console.log(action)
        return { ...store, wrongAnswerOptions: action.wrongAnswerOptions }
    }
    if (action.type === 'SET_WRONG_IMAGE_OPTIONS') {
        console.log(action)
        return { ...store, wrongImageOptions: action.wrongImageOptions }
    }
    return store
}

export const gameInitialization = (gameLength, images, user, gamemode) => {
    const imageToAsk = selectNextImage(undefined, images);
    const wrongAnswerOptions = selectWrongAnswerOptions(images, imageToAsk)
    const wrongImageOptions = selectWrongImageOptions(images, imageToAsk)
    console.log(images)
    console.log(gameLength)
    return {
        type: 'INIT_GAME',
        gameLength: gameLength,
        endCounter: gameLength,
        currentImage: imageToAsk,
        wrongAnswerOptions: wrongAnswerOptions,
        wrongImageOptions: wrongImageOptions,
        surpriseGameMode: Math.floor(Math.random() * 4),
        images: images,
        answers: [],
        gamemode: gamemode,
        user: user,
        totalSeconds: 0,
        totalScore: 0
    }
}

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

export const setImageToAsk = (images, answers) => {
    const imageToAsk = selectNextImage(answers, images);
    return {
        type: 'SET_IMAGE_TO_ASK',
        currentImage: imageToAsk
    }
}

export const setWrongAnswerOptions = (currentImage, images) => {
    const wrongAnswerOptions = selectWrongAnswerOptions(images, currentImage);
    return {
        type: 'SET_WRONG_ANSWER_OPTIONS',
        wrongAnswerOptions: wrongAnswerOptions
    }
}

export const setWrongImageOptions = (currentImage, images) => {
    const wrongImageOptions = selectWrongImageOptions(images, currentImage);
    return {
        type: 'SET_WRONG_IMAGE_OPTIONS',
        wrongImageOptions: wrongImageOptions
    }
}

export default gameReducer

function selectWrongAnswerOptions(images, currentImage) {
    let allLatinNames = images.map(img => img.bone.nameLatin);
    allLatinNames = Array.from(new Set(allLatinNames));
    allLatinNames = allLatinNames.filter(answer => answer !== currentImage.bone.nameLatin);
    const selectedAnswers = [];
    const numberOfButtons = Math.min(3, allLatinNames.length);
    while (selectedAnswers.length < numberOfButtons) {
        const index = Math.floor(Math.random() * allLatinNames.length);
        selectedAnswers.push(allLatinNames[index]);
        allLatinNames.splice(index, 1);
    }
    return selectedAnswers;
}

function selectWrongImageOptions(images, currentImage) {
    const allImages = images.filter(img => !((img.animal === currentImage.animal) && (img.bone === currentImage.bone)));
    const selectedImages = [];
    const numberOfImages = Math.min(3, allImages.length);
    while (selectedImages.length < numberOfImages) {
        const index = Math.floor(Math.random() * allImages.length);
        selectedImages.push(allImages[index]);
        allImages.splice(index, 1);
    }
    return selectedImages;
}

function selectNextImage(answers, images) {
    let noAskedImages;
    if (!answers === undefined) {
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
        let haveToLearn = answers.filter(ans => ans.correctness < values)
        haveToLearn = haveToLearn.map(ans => ans.image)
        imageToAsk = haveToLearn[Math.floor(Math.random() * haveToLearn.length)]
    }
    return imageToAsk;
}

