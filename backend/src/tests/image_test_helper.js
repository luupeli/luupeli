const Image = require('../models/image')

// Test images to populate the test database
const initialImages = [
  {
    difficulty: 'easy',
    url: 'luu.jpg'
  },
  {
    difficulty: 'easy',
    url: 'luu2.gif'
  },
  {
    difficulty: 'easy',
    url: 'luu3.mp3'
  }
]

const formatImage = (image) => {
  return {
    id: image._id,
    difficulty: image.difficulty,
    url: image.url,
    bone: image.bone
  }
}

const nonExistingImageId = async () => {
  const image = new Image()
  await image.save()
  await image.remove()
  return image._id.toString()
}

const imagesInDb = async () => {
  const images = await Image.find({})
  return images.map(formatImage)
}

module.exports = {
  initialImages, formatImage, imagesInDb, nonExistingImageId
}