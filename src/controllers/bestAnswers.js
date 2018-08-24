const moment = require('moment');
const answersRouter = require('express').Router()
const Answer = require('../models/answer')
const BestAnswer = Answer.Best

answersRouter.get('/', async(request, response) => {
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
	if (request.query.image !== undefined) {
		searchParams = { ...searchParams, image: request.query.image }
	}

	let min = 0
	let max = 100
	if (request.query.correctness_min !== undefined) {
		min = Number(request.query.correctness_min)
	}
	if (request.query.correctness_max !== undefined) {
		max = request.query.correctness_max
	}

	const answers = await BestAnswer
		.find(searchParams)
		.where('correctness').gte(min).lte(max)
		.populate('images')
		.populate('gameSession')
		.populate('user')

	response.json(timeFilter(request, answers).map(BestAnswer.format))
})

answersRouter.get('/:id', async(request, response) => {	
	try {
		const answer = await BestAnswer
			.findById(request.params.id)
			.populate('images')
			.populate('gameSession')
			.populate('user')

		if (answer) {
			response.json(BestAnswer.format(answer))
		} else {
			response.status(404).end()
		}
	} catch (err) {
		console.log(err)
    response.status(404).send({ error: 'malformatted id' })
	}
})

answersRouter.delete('/:id', async(request, response) => {
	try {
		const answer = await BestAnswer.findById(request.params.id)
		await BestAnswer.remove(answer)
		
		response.status(204).end()
	} catch (err) {
		console.log(err)
		response.status(400).send({ error: 'malformatted id' })
	}
})


module.exports = answersRouter

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