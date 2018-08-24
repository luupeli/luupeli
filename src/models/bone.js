const mongoose = require('mongoose')

// Database schema for bone
const boneSchema = new mongoose.Schema({
  name: String,
  nameLatin: String,
  altNameLatin: String,
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'image' }],
  bodyPart: { type: mongoose.Schema.Types.ObjectId, ref: 'bodyPart' },
  animals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'animal' }],
  description: String,
  lastModified: { type: Date }, 
  creationTime: { type: Date }
})

// Formats bone from the database to be used in the app
boneSchema.statics.format = (bone) => {
  return {
    id: bone._id,
    name: bone.name,
    nameLatin: bone.nameLatin,
    altNameLatin: bone.altNameLatin,
    images: bone.images,
    bodyPart: bone.bodyPart,
    animals: bone.animals,
    description: bone.description,
    lastModified: bone.lastModified,
    creationTime: bone.creationTime
  }
}

const Bone = mongoose.model('bone', boneSchema)

module.exports = Bone