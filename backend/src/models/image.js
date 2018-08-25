const mongoose = require('mongoose')

// Database schema for image
const imageSchema = new mongoose.Schema({
    difficulty: String,
    url: String,
    bone: { type: mongoose.Schema.Types.ObjectId, ref: 'bone' },
    animal: { type: mongoose.Schema.Types.ObjectId, ref: 'animal' },
    copyright: String,
    photographer: String,
    handedness: String,
    description: String,
    lastModified: { type: Date }, 
    creationTime: { type: Date },
    attempts: Number,
    correctAttempts: Number
})

// Formats image from the database to be used in the app
imageSchema.statics.format = (image) => {
    return {
        id: image._id,
        difficulty: image.difficulty,
        url: image.url,
        bone: image.bone,
        animal: image.animal,
        copyright: image.copyright,
        photographer: image.photographer,
        handedness: image.handedness,
        description: image.description,
        lastModified: image.lastModified, 
        creationTime: image.creationTime,
        attempts: image.attempts,
        correctAttempts: image.correctAttempts
    }
}

const image = mongoose.model('image', imageSchema)

module.exports = image