import StringSimilarity from 'string-similarity'

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
        startedAt: new Date().getTime(),
        stoppedAt: undefined,
        playSound: false,
        gameDifficulty: "medium",
        gameStarted: new Date().getTime()
    }
}

const gameReducer = (store = initialState.game, action) => {
    if (action.type === 'INIT_GAME') {
        console.log(action)
        return {
            ...store, posted: false, needToChangeQuestion: true, surpriseGameMode: action.surpriseGameMode, wrongImageOptions: action.wrongImageOptions,
            wrongAnswerOptions: action.wrongAnswerOptions, currentImage: action.currentImage, user: action.user,
            totalScore: action.totalScore, gameLength: action.gameLength, endCounter: action.endCounter,
            totalSeconds: action.totalSeconds, images: action.images, animals: action.animals,
            bodyparts: action.bodyparts, answers: action.answer, gamemode: action.gamemode, playSound: action.playSound,
            gameDifficulty: action.gameDifficulty, startTime: action.startTime, getGameClock: action.getGameClock,
            gameStarted: action.gameStarted
        }
    }
    if (action.type === 'SET_ANSWER') {
        console.log(action)
        if (store.answers === undefined) {
            return { ...store, needToChangeQuestion: store.surpriseGameMode !== action.surpriseGameMode, surpriseGameMode: action.surpriseGameMode, answers: action.answer, endCounter: store.endCounter - 1, gameClock: 0, totalSeconds: action.totalSeconds, totalScore: action.totalScore }
        } else {
            return { ...store, needToChangeQuestion: store.surpriseGameMode !== action.surpriseGameMode, surpriseGameMode: action.surpriseGameMode, answers: store.answers.concat(action.answer), endCounter: store.endCounter - 1, gameClock: 0, totalSeconds: store.totalSeconds + action.totalSeconds, totalScore: store.totalScore + action.totalScore }
        }
    }
    if (action.type === 'SET_IMAGE_TO_WRITING_GAME') {
        console.log(action)
        return { ...store, currentImage: action.currentImage }
    }
    if (action.type === 'SET_IMAGES_TO_MULTIPLE') {
        console.log(action)
        return { ...store, wrongAnswerOptions: action.wrongAnswerOptions, currentImage: action.currentImage }
    }
    if (action.type === 'SET_IMAGES_TO_IMAGE_MULTIPLE') {
        console.log(action)
        return { ...store, wrongImageOptions: action.wrongImageOptions, currentImage: action.currentImage }
    }
    if (action.type === 'ADVANCE_GAMECLOCK') {

        return { ...store, gameClock: store.gameClock + 1 }
    }
    if (action.type === 'TOGGLE_SOUND') {

        return { ...store, playSound: store.playSound + 1 }
    }
    if (action.type === 'START_GAME_CLOCK') {
        return { ...store, startedAt: action.now, stoppedAt: undefined }
    }
    if (action.type === 'STOP_GAME_CLOCK') {
        return { ...store, stoppedAt: action.now, gameClock: action.now - store.startedAt }
    }
    if (action.type === 'SET_NEED_TO_CHANGE_QUESTION_FALSE') {
        return { ...store, needToChangeQuestion: false }
    }
    if (action.type === 'SET_SESSION_TO_POSTED') {
        return { ...store, posted: true }
    }
    return store
}


export const gameInitialization = (gameLength, images, user, gamemode, animals, bodyparts, playSound, gameDifficulty) => {
    const imageToAsk = selectNextImage(undefined, images);
    const wrongAnswerOptions = selectWrongAnswerOptions(images, imageToAsk, gameDifficulty)
    const wrongImageOptions = selectWrongImageOptions(images, imageToAsk)


    console.log(images)
    console.log(gameLength)
    console.log(animals)
    console.log(bodyparts)

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
        gameClock: 0,
        playSound: playSound,
        gameDifficulty: gameDifficulty,
        gameStarted: new Date().getTime()
    }
}

export const startGameClock = () => {
    return {
        type: "START_GAME_CLOCK",
        now: new Date().getTime()
    };
}

export const setNeedToChangeQuestionFalse = () => {
    return {
        type: "SET_NEED_TO_CHANGE_QUESTION_FALSE"
    };
}

export const stopGameClock = () => {
    return {
        type: "STOP_GAME_CLOCK",
        now: new Date().getTime()
    };
}

// This sets a new answer to the answers array.
export const setAnswer = (image, correctness, answer, animal, seconds, score) => {
    return {
        type: 'SET_ANSWER',
        answer: [{
            image: image,
            correctness: correctness,
            answer: answer,
            animal: animal,
            seconds: seconds,
            score: score
        }],
        totalSeconds: seconds,
        totalScore: score,
        surpriseGameMode: Math.floor(Math.random() * 4)
    }
}

// When the previous question is answered, this call will choose the image for the next question.
export const setImageToWritingGame = (images, answers, difficulty) => {

    const imageToAsk = selectNextImage(answers, images, difficulty, 'kirjoituspeli');
    console.log(answers + '!!!')
    return {
        type: 'SET_IMAGE_TO_WRITING_GAME',
        currentImage: imageToAsk
    }
}

// When the previous question is answered, this call will choose incorrect answer options for multiple choice game mode (MultipleChoiceGame).
export const setImagesToMultipleChoiceGame = (images, answers, difficulty) => {
    const imageToAsk = selectNextImage(answers, images, difficulty);
    const wrongAnswerOptions = selectWrongAnswerOptions(images, imageToAsk, difficulty);
    return {
        type: 'SET_IMAGES_TO_MULTIPLE',
        wrongAnswerOptions: wrongAnswerOptions,
        currentImage: imageToAsk
    }
}

// When the previous question is answered, this call will choose incorrect image options for multiple choice game mode (ImageMultipleChoiceGame).
export const setImagesToImageMultipleChoiceGame = (images, answers, difficulty) => {
    const imageToAsk = selectNextImage(answers, images, difficulty);
    const wrongImageOptions = selectWrongImageOptions(images, imageToAsk, difficulty);
    return {
        type: 'SET_IMAGES_TO_IMAGE_MULTIPLE',
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

export const toggleSound = () => {
    return {
        type: 'TOGGLE_SOUND'
    }
}

export const setSessionToPosted = () => {
    return {
        type: 'SET_SESSION_TO_POSTED'
    }
}



export default gameReducer

/** This method defines the wrong answer options. We only use the bones that match the game settings. 
 * The bones are chosen randomly. If there are too few bones, the answer options will be less than three.
 * The correct answer can not be among the wrong answers.
*/
function selectWrongAnswerOptions(images, currentImage, difficulty) {

    // Tehdään taulukko latinankielisistä nimistä ja poistetaan dublikaatit sekä oikea vastaus
    let allLatinNames = images.map(img => img.bone.nameLatin)
    allLatinNames = Array.from(new Set(allLatinNames))
    allLatinNames = allLatinNames.filter(answer => answer !== currentImage.bone.nameLatin)

    // Verrataan kutakin latinankielistä nimeä oikeaan vastaukseen ja tallennetaan samankaltaisuus
    allLatinNames = allLatinNames.map(nameLatin => {
        return ({
            nameLatin: nameLatin, similarity: StringSimilarity.compareTwoStrings(nameLatin, currentImage.bone.nameLatin)
        })
    })
    // Järjestetään taulukko siten, että lähimpänä oikeaa vastausta oleva on ylimpänä
    allLatinNames.sort((a, b) => b.similarity - a.similarity)
    console.log(allLatinNames)

    // Valitaan väärät vastaukset peliin. 
    let answersToGame = []
    const numberOfButtons = Math.min(3, allLatinNames.length);
    // Helpolla tasolla arvonta kohdistuu kaikkiin nimiin
    let howFarFromCorrect = allLatinNames.length

    if (difficulty === 'medium') {
        // keskivaikealla tasolla arvonta kohdistuu samankaltaisuuslistassa top-20%
        howFarFromCorrect = Math.max(2, howFarFromCorrect / 5)
    } else if (difficulty === 'hard') {
        // Vaikealla tasolla arvonta kohdistuu vain samankaltaisuuslistassa top-viiteen
        howFarFromCorrect = 2
    }

    while (answersToGame.length < numberOfButtons) {
        const index = Math.floor(Math.random() * howFarFromCorrect)
        answersToGame.push(allLatinNames[index].nameLatin)
        allLatinNames.splice(index, 1)
    }

    answersToGame = answersToGame.map(ans => {
        return ({
            nameLatin: ans, correct: false
        })
    })
    const correctAns = { nameLatin: currentImage.bone.nameLatin, correct: true }
    answersToGame.push(correctAns)

    var shuffle = require('shuffle-array')
    shuffle(answersToGame)
    console.log(correctAns)
    console.log(answersToGame)
    return answersToGame;
}

/** This method defines the wrong image options. We only use the images that match the game settings. 
 * The images are chosen randomly. If there are too few images, the image options will be less than three.
 * The correct answer can not be among the wrong answers.
*/
function selectWrongImageOptions(images, currentImage, difficulty) {
    // Tehdään taulukko kuvista ja jätetään oikea kuva pois
    let allImages = images.filter(img => !((img.animal.name === currentImage.animal.name) && (img.bone.nameLatin === currentImage.bone.nameLatin)));
    let selectedImages = []

    // Helpolla tasolla arvonta kohdistuu kaikkiin kuviin
    if (difficulty === 'easy') {
        while (selectedImages.length < Math.min(3, allImages.length)) {
            const index = Math.floor(Math.random() * allImages.length);
            selectedImages.push(allImages[index]);
            allImages.splice(index, 1);
        }
    } else {
        // Ryhmitellään luut ruumiinosan mukaan
        let groupByBodyPart = Object.values(allImages.reduce(function (acc, obj) {
            var key = obj.bone.bodyPart;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {}));

        // Valitaan oikeaa vastausta vastaava ruumiinosa
        groupByBodyPart = groupByBodyPart.filter(imgGroup => imgGroup.some(img => img.bone.bodyPart === currentImage.bone.bodyPart))

        console.log(groupByBodyPart)

        // Vaikealla tasolla valitaan kaksi kuvaa samasta luusta, jotka ovat eri eläimestä.
        // Täytyy siis osata tunnistaa luu (kaksi vaihtoehtoa) ja sitten eläin (kaksi vaihtoehtoa).
        if (difficulty === 'hard') {
            const sameBoneDifferentAnimal = groupByBodyPart[0].filter(img => img.bone._id === currentImage.bone._id)
            let imagesWithSameBone = groupByBodyPart[0].filter(img => img.bone._id !== currentImage.bone._id && img.bone.bodyPart === currentImage.bone.bodyPart)
            // Ryhmitellään samasta luusta olevat kuvat
            imagesWithSameBone = Object.values(imagesWithSameBone.reduce(function (acc, obj) {
                var key = obj.bone._id;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(obj);
                return acc;
            }, {}));

            // Jos samasta luusta on alle kaksi kuvaa, sitä ei hyväksytä
            imagesWithSameBone = imagesWithSameBone.filter(imgGroup => imgGroup.length >= 2)

            // Vertaillaan luiden nimien samankaltaisuutta oikeaan vastaukseen
            imagesWithSameBone = imagesWithSameBone.map(imgGroup => {
                return ({
                    imgGroup: imgGroup, similarity: StringSimilarity.compareTwoStrings(imgGroup[0].bone.nameLatin, currentImage.bone.nameLatin)
                })
            })
            // Järjestetään taulukko siten, että lähimpänä oikeaa vastausta oleva on ylimpänä
            imagesWithSameBone.sort((a, b) => b.similarity - a.similarity)

            console.log(imagesWithSameBone)
            console.log(sameBoneDifferentAnimal)
            if (sameBoneDifferentAnimal.length >= 1 && imagesWithSameBone.length >= 1) {
                // Valitaan oikealle vastaukselle pari (vastaava luu toiselta eläimeltä)
                const index = Math.floor(Math.random() * sameBoneDifferentAnimal.length);
                selectedImages.push(sameBoneDifferentAnimal[index]);
                sameBoneDifferentAnimal.splice(index, 1);

                // Valitaan vaihtoehtoinen luu
                const oIndex = Math.floor(Math.random() * Math.min(1, imagesWithSameBone.length));
                while (selectedImages.length < 3) {
                    const index = Math.floor(Math.random() * imagesWithSameBone[oIndex].imgGroup.length);
                    selectedImages.push(imagesWithSameBone[oIndex].imgGroup[index]);
                    imagesWithSameBone[oIndex].imgGroup.splice(index, 1);
                    console.log(selectedImages)
                }
            } else {
                // Jos kuvia ei ole tarpeeksi, vaihdetaan tasoksi medium
                difficulty = 'medium'
            }
        }
        // Keskitasolla arvonta kohdistuu kuviin, jotka ovat samasta ruumiinosasta oikean vastauksen kanssa.
        if (difficulty === 'medium') {
            const sameBodyPart = groupByBodyPart[0]
            while (selectedImages.length < Math.min(3, sameBodyPart.length)) {
                const index = Math.floor(Math.random() * sameBodyPart.length);
                selectedImages.push(sameBodyPart[index])
                sameBodyPart.splice(index, 1)
            }
        }
    }

    console.log(selectedImages)

    selectedImages = selectedImages.map(image => {
        return ({
            ...image, correct: false
        })
    })

    // Lisätään oikea vastaus kuvavaihtoehtoihin
    const correctImg = { ...currentImage, correct: true }
    selectedImages.push(correctImg)

    var shuffle = require('shuffle-array')
    shuffle(selectedImages)
    console.log(correctImg)
    console.log(selectedImages)
    return selectedImages;
}

/**
This method chooses an image for the next question.  
We first use all the images that have not yet been asked. 
Then we use those images that correctness is less than correctness average. 
 */
function selectNextImage(answers, images, difficulty, gamemode) {
    let noAskedImages;

    // Tässä suodatetaan pois kuvat, jotka on jo kysytty
    if (answers !== undefined) {
        noAskedImages = images.filter(img => !answers.some(ans => ans.image.id === img.id));
    }
    else {
        noAskedImages = images;
    }

    // Jos admin on määritellyt kuvan helpoksi, se tallennetaan tietokantaan arvolla 0. 
    // Tämä on kuitenkin ongelmallista kertolaskun kannalta myöhemmin, joten muutetaan 0 -> 1.
    // Lisäksi vaikea kuva ei ole 100 kertaa vaikeampi vaan kaksi kertaa vaikeampi 100 -> 2.
    noAskedImages = noAskedImages.map(img => {
        if (img.difficulty === undefined || img.difficulty === '0') {
            return { ...img, difficulty: 1 }
        }
        return { ...img, difficulty: 2 }
    })
    console.log(noAskedImages)

    /* 
    - Lasketaan kullekin kuvalle difficultyAvg painokertoimien yhdistelmänä: mitä isompi difficultyAvg, sitä vaikeampi kuva
    - correctness/attempts -arvo vähennetään sadasta, koska tämä käyttäytyy muutoin päin vastoin kuin haluaisimme.
    - Kaikkien arvojen alin mahdollinen luku on 1, joten mikään arvo ei vaikuta alentavasti vaikeuteen, arvot ovat välillä 1-2.
    */
    if (gamemode !== undefined) {
        if (gamemode === 'kirjoituspeli') {
            noAskedImages = noAskedImages.map(img => {
                if (img.attempts !== undefined && img.correctness !== undefined && img.difficulty !== undefined && img.correctness !== 0) {
                    console.log('pituus: ' + Math.max(10, img.bone.nameLatin.length) / 10 + ', statistiikka-vaikeus ' + (1 + ((100 - Number(img.correctness / img.attempts)) / 100)) + ' , admin-vaikeus ' + img.difficulty)
                    console.log('kokonaisvaikeus: ' + Math.max(8, img.bone.nameLatin.length) / 8 * (1 + ((100 - Number(img.correctness / img.attempts)) / 100)) * img.difficulty)
                    return { ...img, difficultyAvg: Math.max(8, img.bone.nameLatin.length) / 8 * ((100 - Number(img.correctness / img.attempts)) / 100) * img.difficulty }
                } else if (img.attempts === undefined || img.correctness === undefined || img.correctness === 0) {
                    return { ...img, difficultyAvg: Math.max(8, img.bone.nameLatin.length) / 8 * img.difficulty }
                } else if (img.difficulty === undefined) {
                    return { ...img, difficultyAvg: Math.max(8, img.bone.nameLatin.length) / 8 * (1 + ((100 - Number(img.correctness / img.attempts)) / 100)) }
                }
                return { ...img, difficultyAvg: 1 }
            })
        }
    } else {
        noAskedImages = noAskedImages.map(img => {
            if (img.attempts !== undefined && img.correctness !== undefined && img.difficulty !== undefined && img.correctness !== 0) {
                console.log('statistiikka-vaikeus ' + (1 + ((100 - Number(img.correctness / img.attempts)) / 100)) + ' , admin-vaikeus ' + img.difficulty)
                console.log(1 + ((100 - Number(img.correctness / img.attempts)) / 100) * img.difficulty)
                return { ...img, difficultyAvg: 1 + ((100 - Number(img.correctness / img.attempts)) / 100) * img.difficulty }
            } else if (img.attempts === undefined || img.correctness === undefined || img.correctness === 0) {
                return { ...img, difficultyAvg: img.difficulty }
            } else if (img.difficulty === undefined) {
                return { ...img, difficultyAvg: 1 + ((100 - Number(img.correctness / img.attempts)) / 100) }
            }
            return { ...img, difficultyAvg: 1 }
        })
    }

    // Järjestetään taulukko difficultyAvg:n mukaan
    noAskedImages.sort((a, b) => a.difficultyAvg - b.difficultyAvg)

    console.log(noAskedImages)

    let easyDifficultyLimit = 0
    let mediumDifficultyLimit = 0
    if (noAskedImages[Math.floor(noAskedImages.length / 3)] !== undefined) {
        // Asetetaan helppojen kuvien maksimiraja ensimmäisen 33% jälkeen
        easyDifficultyLimit = noAskedImages[Math.floor(noAskedImages.length / 3)].difficultyAvg
        // Asetetaan keskitason kuvien maksimiraja ensimmäisen 66% jälkeen
        mediumDifficultyLimit = noAskedImages[Math.floor(noAskedImages.length / 3 * 2)].difficultyAvg
    }

    console.log('easy-difficulty-limit ' + easyDifficultyLimit)
    console.log('medium-difficulty-limit ' + mediumDifficultyLimit)

    // Arvotaan luku väliltä 1-10
    let randomNumber = Math.floor(Math.random() * 9) + 1
    console.log('randomNumber ' + randomNumber)

    if (difficulty === 'easy' && randomNumber <= 5) {
        // Jos arvottu luku on helpossa pelimuodossa 5 tai alle, kysytään helppo kuva
        let images = noAskedImages.filter(img => img.difficultyAvg <= easyDifficultyLimit)
        if (images.length !== 0) {
            noAskedImages = images
        }
    }

    if (difficulty === 'medium' && 2 < randomNumber && randomNumber < 8) {
        // Jos arvottu numero on keskitasoisessa pelissä välissä 2-8, kysytään keskitason kuva
        let images = noAskedImages.filter(img => img.difficultyAvg > easyDifficultyLimit && img.difficultyAvg < mediumDifficultyLimit)
        if (images.length !== 0) {
            noAskedImages = images
        }
    }

    if (difficulty === 'hard' && 5 <= randomNumber) {
        // Jos arvottu numero on vaikeassa pelissä 5 tai isompi, kysytään vaikea kuva
        let images = noAskedImages.filter(img => img.difficultyAvg >= mediumDifficultyLimit)
        if (images.length !== 0) {
            noAskedImages = images
        }
    }

    // Jos arvottu numero ei osunut mihinkään yllä olevaan, kysytään täysin sattumanvarainen kuva.

    let imageToAsk
    if (noAskedImages.length > 0) {
        // Arvotaan kuva siitä joukosta, mikä edellä määriteltiin
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

