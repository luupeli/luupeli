const mongoose = require('mongoose')

// Database schema for animal
const animalSchema = new mongoose.Schema({
  name: String
})

// Formats bone from the database to be used in the app
animalSchema.statics.format = (animal) => {
  return {
    id: animal._id,
    name: animal.name,
    //bone to image
    bones: animal.bones
  }
}

const Animal = mongoose.model('animal', animalSchema)

module.exports = Animal