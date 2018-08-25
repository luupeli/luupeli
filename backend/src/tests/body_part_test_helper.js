const BodyPart = require('../models/bodyPart')

const initialBodyParts = [
    {
        name: 'pää'
    },
    {
        name: 'keho'
    },
    {
        name: 'eturaaja'
    },
    {
        name: 'takaraaja'
    }
]

const formatBodyPart = (bodyPart) => {
    return {
        id: bodyPart._id,
        name: bodyPart.name
    }
}

const bodyPartsInDb = async () => {
    const bodyParts = await BodyPart.find({})
    return bodyParts.map(formatBodyPart)
}

module.exports = {
    initialBodyParts, formatBodyPart, bodyPartsInDb
  }