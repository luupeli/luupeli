const gameSessionsRouter = require('express').Router()
const GameSession = require('../models/gameSession')
const User = require('../models/user')
const Answer = require('../models/answer')
const moment = require('moment');

gameSessionsRouter.post('/', async (request, response) => {
	try {
		const body = request.body

		if (body.animals === undefined) {
			return response.status(400).json({ error: 'animals missing' })
		} else if (body.bodyparts === undefined) {
			return response.status(400).json({ error: 'bodyparts missing' })
		} else if (body.gamemode === undefined) {
			return response.status(400).json({ error: 'game mode missing' })
		} else if (body.length === undefined) {
			return response.status(400).json({ error: 'game length missing' })
		} else if (body.seconds === undefined) {
			return response.status(400).json({ error: 'seconds missing' })
		} else if (body.answers === undefined) {
			return response.status(400).json({ error: 'answers missing' })
		}
		else if (body.gameDifficulty === undefined) {
			return response.status(400).json({ error: 'game difficulty missing' })
		}
		const gameSession = new GameSession({
			user: body.user,
			gamemode: body.gamemode,
			length: body.length,
			animals: body.animals,
			bodyparts: body.bodyparts,
			correctAnswerCount: body.answers.filter(ans => ans.correctness === 100).length,
			almostCorrectAnswerCount: body.answers.filter(ans => ans.correctness > 70 && ans.correctness < 100).length,
			seconds: body.seconds,
			totalScore: body.answers.reduce((a, b) => a + b.score, 0),
			answers: [],
			gameDifficulty: body.gameDifficulty,
			timeStamp: Date.now()
		})
		const savedGameSession = await gameSession.save()

		// Connecting game session and answers
		const savedAnswers = []
		for (let i = 0; i < body.answers.length; i++) {
			const answer = {
				user: body.user,
				image: body.answers[i].image.id,
				correctness: body.answers[i].correctness,
				input: body.answers[i].answer,
				animal: body.answers[i].animal,
				points: body.answers[i].score,
				seconds: body.answers[i].seconds,
				gamemode: body.gamemode,
				gamesession: savedGameSession.id,
				gameDifficulty: body.gameDifficulty,
				creationTime: Date.now()
			}

			const savedAnswer = await new Answer(answer).save()
			savedAnswers.push(savedAnswer)

			// Here we check is this answer the best answer
			if (body.user !== null && body.user !== undefined) {
				const previousBest = await Answer.Best.find({ user: body.user, image: body.answers[i].image.id })
				if ((body.gameDifficulty.includes('medium') || body.gameDifficulty.includes('hard')) &&
					(previousBest.length === 0 || previousBest[0].score <= answer.score)) {
					await new Answer.Best(answer).save()
				}
			}
		}

		savedGameSession.answers = savedAnswers.map(sa => sa.id)
		await savedGameSession.save()

		response.json(GameSession.format(savedGameSession))
	} catch (err) {
		console.log(err)
		response.status(500).json({ error: 'something went wrong' })
	}
})

gameSessionsRouter.get('/', async (request, response) => {
	let searchParams = {}
	if (request.query.user !== undefined) {
		searchParams = { ...searchParams, user: request.query.user }
	}
	if (request.query.gamemode !== undefined) {
		searchParams = { ...searchParams, gamemode: request.query.gamemode }
	}
	if (request.query.game_difficulty !== undefined) {
		searchParams = { ...searchParams, gameDifficulty: request.query.game_difficulty }
	}

	const gameSessions = await GameSession
		.find(searchParams)
		.populate('user')
		.populate('animals')
		.populate('bodyparts')
		.populate('answers')

	response.json(timeFilter(request, gameSessions).map(GameSession.format));
})

gameSessionsRouter.get('/top_list_all/', async (request, response) => {
	let limit = 4000
	if (request.query.limit !== undefined) {
		limit = Number(request.query.limit)
	}

	const users = await User.find({})

	let gameSessions = await GameSession
		.aggregate([
			{ $group: { _id: "$user", total: { $sum: "$totalScore" } } },
			{ $sort: { total: -1 } },
			{ $limit: limit }
		])

	gameSessions = gameSessions.filter(gs => gs._id !== null)
	gameSessions = gameSessions.map(gs => {
		return ({
			...gs, user: users.filter(user => user.id.includes(gs._id))[0]
		})
	})

	response.json(gameSessions);
})

gameSessionsRouter.get('/top_list_game', async (request, response) => {
	let searchParams = {}
	if (request.query.user !== undefined) {
		searchParams = { ...searchParams, user: request.query.user }
	}
	if (request.query.gamemode !== undefined) {
		searchParams = { ...searchParams, gamemode: request.query.gamemode }
	}
	if (request.query.game_difficulty !== undefined) {
		searchParams = { ...searchParams, gameDifficulty: request.query.game_difficulty }
	}
	let limit = 4000
	if (request.query.limit!== undefined) {
		limit = Number(request.query.limit)
	}

	const gameSessions = await GameSession
		.find(searchParams)
		.sort('-totalScore')
		.limit(limit)
		.populate('user')
		.populate('animals')
		.populate('bodyparts')
		.populate('answers')

	response.json(timeFilter(request, gameSessions).map(GameSession.format));
})

gameSessionsRouter.get('/:id', async (request, response) => {
	try {
		const gameSession = await GameSession
			.findById(request.params.id)
			.populate('user')
			.populate('animals')
			.populate('bodyparts')
			.populate('answers')

		if (gameSession) {
			response.json(GameSession.format(gameSession))
		} else {
			response.status(404).end()
		}
	} catch (err) {
		console.log(err)
		response.status(404).send({ error: 'malformatted id' })
	}
})

gameSessionsRouter.delete('/:id', async (request, response) => {
	try {
		const gameSession = await GameSession.findById(request.params.id)
		await GameSession.remove(gameSession)

		response.status(204).end()
	} catch (err) {
		console.log(err)
		response.status(400).send({ error: 'malformatted id' })
	}
})

module.exports = gameSessionsRouter

function timeFilter(request, gameSessions) {
	let timeFilter;
	if (request.query.start === undefined && request.query.end === undefined) {
		timeFilter = gameSessions;
	}
	if (request.query.start === undefined) {
		timeFilter = gameSessions.filter(g => {
			const date = moment(g.timeStamp).format().substring(0, 10);
			return moment(date).isBefore(request.query.end);
		});
	}
	else if (request.query.end === undefined) {
		timeFilter = gameSessions.filter(g => {
			const date = moment(g.timeStamp).format().substring(0, 10);
			return moment(date).isBetween(request.query.start, request.query.end, null, '[]');
		});
	}
	else {
		timeFilter = gameSessions.filter(g => {
			const date = moment(g.timeStamp).format().substring(0, 10);
			return moment(date).isBetween(request.query.start, request.query.end, null, '[]');
		});
	}
	return timeFilter
}
