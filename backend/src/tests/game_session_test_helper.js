const GameSession = require('../models/gameSession')
const { initialUsers1 } = require('./user_test_helper')


const initialGameSessions = [
  {
    user: '5b2b8c851867cd00142634e7',
    gamemode: 'kirjoituspeli',
    length: 3,
    animals: ["5b2b8c851867cd00142634e7", "5b2b8c8d1867cd00142634e8"],
    bodyparts: ["5b2b8d4b1867cd00142634eb", "5b2b8d521867cd00142634ec"],
    correctAnswerCount: 1,
    almostCorrectAnswerCount: 1,
    timeStamp: "2018-06-26T21:01:31.169Z",
    seconds: 12,
    answers: [],
    gameDifficulty: 'medium'
  },

  {
    user: '5b2b8c851867cd00142634e7',
    gamemode: 'monivalintapeli',
    length: 7,
    animals: ["5b2b8c851867cd00142634e9", "5b2b8c8d1867cd00142634ea"],
    bodyparts: ["5b2b8d4b1867cd00142634eb", "5b2b8d521867cd00142634ec",],
    correctAnswerCount: 4,
    almostCorrectAnswerCount: 2,
    timeStamp: "2018-06-26T21:01:31.169Z",
    seconds: 42,
    gameDifficulty: 'medium'
  },
  {
    user: '5b2b8c851867cd00142634e7',
    gamemode: 'viallinen update',
    length: 7,
    animals: ["5b2b8c851867cd00142634e9", "5b2b8c8d1867cd00142634ea"],
    bodyparts: ["5b2b8d4b1867cd00142634eb", "5b2b8d521867cd00142634ec"],
    correctAnswerCount: 4,
    almostCorrectAnswerCount: 2,
    timeStamp: "2018-06-26T21:01:31.169Z",
    seconds: 12,
    gameDifficulty: 'medium'
  }
]

const gameSessionsToBeAdded = [
  {
    user: '5b2b8c851867cd00142634e7',
    gamemode: 'kimblepeli',
    length: 7,
    animals: [{ id: "5b2b8c8d1867cd00142634ea" }],
    bodyparts: [{ id: "5b2b8d521867cd00142634ec" }],
    answers: [{
      id: "5b2b8d521867cd00142634ec",
      user: "5b5ebe2ede819000146952d8",
      image: "5b639ecf21c51700147c17df",
      correctness: 100,
      input: "os temporale",
      points: 4240,
      seconds: 101,
      gamemode: "kirjoituspeli",
      gamesession: "5b6dcf63f66a5a7e34e510e4",
      gameDifficulty: "medium",
      creationTime: "2018-08-10T17:46:11.226Z",
      correctness: 90
    }],
    timeStamp: "2018-06-26T21:01:31.169Z",
    seconds: 12,
    gameDifficulty: 'medium'
  },
  {
    user: '5b2b8c851867cd00142634e7',
    gamemode: 'kimblepeli',
    length: 7,
    animals: [{ id: "5b2b8c8d1867cd00142634ea" }],
    bodyparts: [{ id: "5b2b8d521867cd00142634ec" }],
    answers: [{ id: "5b2b8d521867cd00142634ec", correctness: 90 }],
    timeStamp: "2018-06-26T21:01:31.169Z",
    seconds: 12,
    gameDifficulty: 'medium'
  }
]

const formatGameSession = (gameSession) => {
  return {
    id: gameSession._id,
    user: gameSession.user,
    gamemode: gameSession.gamemode,
    difficulty: gameSession.difficulty,
    animals: gameSession.animals,
    bodyparts: gameSession.bodyparts,
    correctAnswerCount: gameSession.correctAnswerCount,
    almostCorrectAnswerCount: gameSession.almostCorrectAnswerCount,
    timeStamp: gameSession.timeStamp,
    seconds: gameSession.seconds,
    gameDifficulty: gameSession.gameDifficulty
  }
}

const gameSessionsInDb = async () => {
  const gameSessions = await GameSession.find({})
  return gameSessions.map(formatGameSession)
}

module.exports = {
  initialGameSessions, gameSessionsToBeAdded, formatGameSession, gameSessionsInDb
}