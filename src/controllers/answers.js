const answersRouter = require('express').Router()
const Answer = require('../models/answer')
const moment = require('moment');

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

	const answers = await Answer
		.find(searchParams)
		.where('correctness').gte(min).lte(max)
		.populate('images')
		.populate('gameSession')
		.populate('user')

	response.json(timeFilter(request, answers).map(Answer.format))
})

answersRouter.get('/top_answers', async(request, response) => {
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

	let limit = 4000
	if (request.query.limit!== undefined) {
		limit = Number(request.query.limit)
	}

	const answers = await Answer
		.find(searchParams)
		.sort('-points')
		.limit(limit)
		.populate('images')
		.populate('gameSession')
		.populate('user')

	response.json(timeFilter(request, answers).map(Answer.format))
})

answersRouter.get('/:id', async(request, response) => {	
	try {
		const answer = await Answer
			.findById(request.params.id)
			.populate('images')
			.populate('gameSession')
			.populate('user')

		if (answer) {
			response.json(Answer.format(answer))
		} else {
			response.status(404).end()
		}
	} catch (err) {
		console.log(err)
    response.status(404).send({ error: 'malformatted id' })
	}
})

answersRouter.get('/user/:userId/img/:imgId', async(request, response) => {
	try {
		const answers = await Answer
			.find({'user': request.params.userId, 'image': request.params.imgId})
			
		if (answers) {
			response.json(answers.map(Answer.format))
		} else {
			console.log(err)
			response.status(404).end()
		}
	} catch (err) {
		console.log(err)
		response.status(404).send({ error: 'malformatted id' })
	}
})

answersRouter.get('/user/:userId', async(request, response) => {
	try {
		const answers = await Answer
			.find({'user': request.params.userId})
			.populate('images')
			
		if (answers) {
			response.json(answers.map(Answer.format))
		} else {
			console.log(err)
			response.status(404).end()
		}
	} catch (err) {
		console.log(err)
		response.status(404).send({ error: 'malformatted id' })
	}
})

answersRouter.delete('/:id', async(request, response) => {
	try {
		const answer = await Answer.findById(request.params.id)
		await Answer.remove(answer)
		
		response.status(204).end()
	} catch (err) {
		console.log(err)
		response.status(400).send({ error: 'malformatted id' })
	}
})

module.exports = answersRouter

function timeFilter(request, list) {
	let timeFilter;
	if (request.query.start === undefined && request.query.end === undefined) {
		timeFilter = list;
	}
	if (request.query.start === undefined) {
		timeFilter = list.filter(g => {
			const date = moment(g.timeStamp).format().substring(0, 10);
			return moment(date).isBefore(request.query.end);
		});
	}
	else if (request.query.end === undefined) {
		timeFilter = list.filter(g => {
			const date = moment(g.timeStamp).format().substring(0, 10);
			return moment(date).isBetween(request.query.start, request.query.end, null, '[]');
		});
	}
	else {
		timeFilter = list.filter(g => {
			const date = moment(g.timeStamp).format().substring(0, 10);
			return moment(date).isBetween(request.query.start, request.query.end, null, '[]');
		});
	}
	return timeFilter
}
