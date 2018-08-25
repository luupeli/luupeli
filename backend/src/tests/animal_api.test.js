const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Animal = require('../models/animal')
const { formatAnimal, initialAnimals, animalsInDb } = require('./animal_test_helper')

const url = '/api/animals'

describe('when there is initially some animals saved', async () => {
	beforeAll(async () => {
		jest.setTimeout(30000)
		await Animal.remove({})
		const animalObjects = initialAnimals.map(a => new Animal(a))
		await Promise.all(animalObjects.map(a => a.save()))
	})

	test('all images are returned as JSON by GET /api/animals', async () => {
		const animalsInDatabase = await animalsInDb()
		const response = await api
			.get(url)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(response.body.length).toBe(animalsInDatabase.length)

		const returnedAnimals = response.body.map(a => a.name)
		animalsInDatabase.forEach(animal => {
			expect(returnedAnimals).toContain(animal.name)
		})
	})

	describe('addition of a new animal', async () => {

		test('succesfully adds valid animal by POST /api/animals', async () => {
			const animalsAtStart = await animalsInDb()
			const animal = {
				name: 'Rotta'
			}
			await api
				.post(url)
				.send(animal)
				.expect(200)
				.expect('Content-Type', /application\/json/)

			const animalsAfterPost = await animalsInDb()
			expect(animalsAfterPost.length).toBe(animalsAtStart.length + 1)
			const names = animalsAfterPost.map(a => a.name)
			expect(names).toContain('Rotta')
		})

		test('does not add an animal without a name', async () => {
			const animals = await animalsInDb()
			const animal = {}
			await api
				.post(url)
				.send(animal)
				.expect(400)

			const animalsAfter = await animalsInDb()
			expect(animalsAfter.length).toBe(animals.length)
		})
	})

	afterAll(() => {
		server.close()
	})
})