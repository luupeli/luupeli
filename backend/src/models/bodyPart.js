const mongoose = require('mongoose')

// Database schema for body part
const bodyPartSchema = new mongoose.Schema({
  name: String
})

// Formats bone from the database to be used in the app
bodyPartSchema.statics.format = (bodyPart) => {
  return {
    id: bodyPart._id,
    name: bodyPart.name
  }
}

const BodyPart = mongoose.model('bodyPart', bodyPartSchema)

module.exports = BodyPart