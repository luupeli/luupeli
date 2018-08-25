const Animal = require('../models/animal')

//Test animals to populate database

const initialAnimals = [
	{
		name: 'Koira'
	},
	{
		name: 'Kissa'
	},
	{
		name: 'Hevonen'
	},
	{
		name: 'Nauta'
	}
]

const formatAnimal = (animal) => {
	return {
		id: animal._id,
		name: animal.name
	}
}

const animalsInDb = async () => {
  const animals = await Animal.find({})
  return animals.map(formatAnimal)
}

module.exports = {
	initialAnimals, formatAnimal, animalsInDb
}