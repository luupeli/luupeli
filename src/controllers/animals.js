const animalsRouter = require('express').Router()
const Animal = require('../models/animal')

// Finds all animals from database after GET-request and returns in JSON
animalsRouter.get('/', async (request, response) => {
  const animals = await Animal
    .find({})
  console.log('operation returned animals ', animals)
  response.json(animals.map(Animal.format))
})

// Creates an animal from given request and saves it to the database
animalsRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    if (body.name === undefined) {
      return response.status(400).json({ error: 'name missing' })
    }

    const animal = new Animal({
      name: body.name
    })

    const savedAnimal = await animal.save()
    response.json(Animal.format(animal))
  } catch (err) {
    console.log(err)
    response.status(500).json({ error: 'something went wrong' })
  }
})

module.exports = animalsRouter