const imagesRouter = require('express').Router()
const Image = require('../models/image')
const Bone = require('../models/bone')
const multer = require('multer')
const cloudinary = require('cloudinary')

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
})

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/
    const extname = filetypes.test(file.originalname.toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb('Error: Images only!')
    }
}

cloudinary.config({
    cloud_name: 'luupeli',
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

// Finds all images from database after GET-request and returns in JSON
imagesRouter.get('/', async (request, response) => {
    const images = await Image
        .find({})
        .populate('bone')
        .populate('animal', { name: 1 })
    console.log('operation returned images ', images)
    response.json(images.map(Image.format))
})

// Finds and returns one image in JSON
imagesRouter.get('/:id', async (request, response) => {
    try {
        const image = await Image
            .findById(request.params.id)
            .populate('bone')
            .populate('animal', { name: 1 })
        if (image) {
            response.json(Image.format(image))
        } else {
            response.status(404).end()
        }
    } catch (err) {
        console.log(err)
        response.status(404).send({ error: 'malformatted id' })
    }
})

// Saves image to Cloudinary and return image url
/* imagesRouter.post('/upload', (request, response) => {
    console.log(request.source)
    cloudinary.uploader.upload(request.body.source, function(result, error) { 
        if (error) {
            response.status(400).json({ error: error })
        } else {
            console.log(result) 
            response.json({ url: result.url })
        }  
    });
})*/

imagesRouter.post('/upload', upload.single('image'), (request, response) => {
    cloudinary.uploader.upload(request.file.path, function (result) {
        response.json({ url: result.public_id })
    })
})


// Creates a image from given request and saves it to the database
// image can be created without bone, should we prepare for this?
imagesRouter.post('/', async (request, response) => {
    try {
        const body = request.body

        if (body.difficulty === undefined) {
            return response.status(400).json({ error: 'difficulty missing' })
        }

        if (body.url === undefined) {
            return response.status(400).json({ error: 'url missing' })
        }

        const image = new Image({
            difficulty: body.difficulty,
            url: body.url,
            bone: body.bone,
            animal: body.animal,
            copyright: body.copyright,
            photographer: body.photographer,
            handedness: body.handedness,
            description: body.description,
            lastModified: Date.now(),
            creationTime: Date.now(),
            attempts: 0,
            correctAttempts: 0,
            correctness: 0
        })
        const savedImage = await image.save()

        // Connect image and bone if bone is given
        if (body.bone !== undefined) {
            const bone = await Bone.findById(body.bone)
            console.log(bone)
            bone.images = bone.images.concat(savedImage._id)
            await bone.save()
        }

        response.json(Image.format(image))
    } catch (err) {
        console.log(err)
        response.status(500).json({ error: 'something went wrong' })
    }
})

// Finds one image by id and deletes it from database. Also removes bone-image connection.
imagesRouter.delete('/:id', async (request, response) => {
    try {
        const image = await Image.findById(request.params.id)
        const bone = await Bone.findById(image.bone._id)

        bone.images = bone.images.filter(i => new String(i._id).valueOf() !== new String(image._id).valueOf())

        await Image.remove(image)
        await bone.save()

        response.status(204).end()
    } catch (err) {
        console.log(err)
        response.status(400).send({ error: 'malformatted id' })
    }
})

// Method does not allow bone and url changing because it's not necessary?
imagesRouter.put('/:id', async (request, response) => {
    try {
        const body = request.body
        const oldImage = await Image.findById(request.params.id)

        const image = {
            difficulty: body.difficulty,
            url: oldImage.url,
            bone: oldImage.bone,
            animal: body.animal,
            copyright: body.copyright,
            photographer: body.photographer,
            handedness: body.handedness,
            description: body.description,
            lastModified: Date.now(),
            creationTime: oldImage.creationTime,
            attempts: body.attempts,
            correctAttempts: body.correctAttempts,
            correctness: body.correctness
        }

        const updatedImage = await Image.findByIdAndUpdate(request.params.id, image, { new: true })

        response.json(Image.format(updatedImage))
    } catch (err) {
        console.log(err)
        response.status(400).send({ error: 'malformatted id' })
    }
})

module.exports = imagesRouter
