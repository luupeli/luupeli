mongoose = require('mongoose')

const gameSessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    gamemode: String,
    length: Number,
    animals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'animal' }],
	bodyparts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'bodyPart' }],
	answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'answer' }],
    correctAnswerCount: Number,
    almostCorrectAnswerCount: Number,
    totalScore: Number,
	seconds: Number,
	gameDifficulty: String,
    timeStamp: { type: Date }
})

gameSessionSchema.statics.format = (gameSession) => {
	return {
		id: gameSession._id,
		user: gameSession.user,
		gamemode: gameSession.gamemode,
		length: gameSession.length,
		animals: gameSession.animals,
		bodyparts: gameSession.bodyparts,
		answers: gameSession.answers,
		correctAnswerCount: gameSession.correctAnswerCount,
		almostCorrectAnswerCount: gameSession.almostCorrectAnswerCount,
		seconds: gameSession.seconds,
		totalScore: gameSession.totalScore,
		gameDifficulty: gameSession.gameDifficulty,
		timeStamp: gameSession.timeStamp
	}
}

const GameSession = mongoose.model("gameSession", gameSessionSchema)

module.exports = GameSession