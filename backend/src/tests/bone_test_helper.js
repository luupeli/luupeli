const Bone = require('../models/bone')
const { initialImages } = require('./image_test_helper')

// Test bones to populate the test database
const initialBones = [
  {
    name: 'ensimmäinen luu',
    nameLatin: 'ensimmanus luumus',
    image: ''
  },
  {
    name: 'toinen luu',
    nameLatin: 'tonus luumus',
    image: ''
  },
  {
    name: 'kolmas luu',
    nameLatin: 'kolmus luumus',
    image: ''
  }
]

const formatBone = (bone) => {
  return {
    id: bone._id,
    name: bone.name,
    nameLatin: bone.nameLatin,
    images: bone.images,
    animals: bone.animals,
    bodyPart: bone.bodyPart
  }
}

const nonExistingBoneId = async () => {
  const bone = new Bone()
  await bone.save()
  await bone.remove()
  return bone._id.toString()
}

const bonesInDb = async () => {
  const bones = await Bone.find({})
  return bones.map(formatBone)
}

module.exports = {
  initialBones, formatBone, bonesInDb, nonExistingBoneId
}