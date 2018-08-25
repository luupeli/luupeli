mongoose = require('mongoose')

//database schema for answer and bestAnswer
const answerSchema = new mongoose.Schema({
	image: { type: mongoose.Schema.Types.ObjectId, ref: 'image' },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
	correctness: Number,
	input: String,
	animal: String,
	points: Number,
	seconds: Number,
	gamemode: String,
	gamesession: { type: mongoose.Schema.Types.ObjectId, ref: 'gameSession' },
	gameDifficulty: String,
	creationTime: { type: Date }
})

// Formats answer from the database to be used in the app
answerSchema.statics.format = (answer) => {
	return {
		id: answer._id,
		image: answer.image,
		user: answer.user,
		correctness: answer.correctness,
		input: answer.input,
		animal: answer.animal,
		points: answer.points,
		seconds: answer.seconds,
		gamemode: answer.gamemode,
		gamesession: answer.gamesession,
		gameDifficulty: answer.gameDifficulty,
		creationTime: answer.creationTime
	}
}

const Answer = mongoose.model("answer", answerSchema)
Answer.Best = mongoose.model("bestAnswer", answerSchema)

module.exports = Answer
