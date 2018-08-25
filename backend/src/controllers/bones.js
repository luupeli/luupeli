const bonesRouter = require('express').Router()
const Bone = require('../models/bone')
const Image = require('../models/image')

// Finds all bones from database after GET-request and returns in JSON
bonesRouter.get('/', async (request, response) => {
  const bones = await Bone
    .find({})
    .populate('images')
    .populate('animals', { name: 1 })
    .populate('bodyPart', { name: 1 })
  console.log('operation returned bones ', bones)
  response.json(bones.map(Bone.format))
})

// Finds and returns one bone in JSON
bonesRouter.get('/:id', async (request, response) => {
  try {
    const bone = await Bone
      .findById(request.params.id)
      .populate('images')
      .populate('animals', { name: 1 })
      .populate('bodyPart', { name: 1 })
    if (bone) {
      response.json(Bone.format(bone))
    } else {
      response.status(404).end()
    }
  } catch (err) {
    console.log(err)
    response.status(404).send({ error: 'malformatted id' })
  }
})

// Creates a bone from given request and saves it to the database
bonesRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    
    if (body.name === undefined) {
      return response.status(400).json({ error: 'name missing' })
    } else if (body.nameLatin === undefined) {
      return response.status(400).json({ error: 'latin name missing' })
    }

    const images = body.images

    const bone = new Bone({
      name: body.name,
      nameLatin: body.nameLatin,
      altNameLatin: body.altNameLatin,
      images: body.images,
      bodyPart: body.bodyPart,
      animals: body.animals,
      description: body.description,
      lastModified: Date.now(),
      creationTime: Date.now()
    })

    // Connect bone and images if images are given
    if (images !== undefined) {
      images.forEach(async imageId => {
        const image = await Image.findById(imageId)
        image.bone = bone
        await image.save()
      });
    }

    const savedBone = await bone.save()
    response.json(Bone.format(bone))
  } catch (err) {
    console.log(err)
    response.status(500).json({ error: 'something went wrong' })
  }
})

// Finds one bone by id and deletes it from database
bonesRouter.delete('/:id', async (request, response) => {
  try {
    const bone = await Bone.findById(request.params.id)
    bone.images.forEach(async imageId => {
      await Image.findByIdAndRemove(imageId)
    })

    await Bone.remove(bone)

    response.status(204).end()
  } catch (err) {
    console.log(err)
    response.status(400).send({ error: 'malformatted id' })
  }
})

// Method does not allow image changing because images add and delete by own methods.
bonesRouter.put('/:id', async (request, response) => {
  try {
    const body = request.body
    const oldBone = await Bone.findById(request.params.id)

    if (!oldBone) {
      response.status(404).end()
    }

    const bone = {
      name: body.name,
      nameLatin: body.nameLatin,
      altNameLatin: body.altNameLatin,
      images: oldBone.images,
      bodyPart: body.bodyPart,
      animals: body.animals,
      description: body.description,
      lastModified: Date.now(),
      creationTime: oldBone.creationTime
    }

    const updatedBone = await Bone.findByIdAndUpdate(request.params.id, bone, { new: true })

    response.json(Bone.format(updatedBone))
  } catch (err) {
    console.log(err)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = bonesRouter