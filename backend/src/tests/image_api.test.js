const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Image = require('../models/image')
const { formatImage, initialImages, imagesInDb, nonExistingImageId } = require('./image_test_helper')

const url = '/api/images'

describe('when there is initially some images saved', async () => {
  beforeAll(async () => {
    jest.setTimeout(30000)
    await Image.remove({})
    const imageObjects = initialImages.map(i => new Image(i))
    await Promise.all(imageObjects.map(i => i.save()))
  })

  test('all images are returned as JSON by GET /api/images', async () => {
    const imagesInDatabase = await imagesInDb()
    const response = await api
      .get(url)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(imagesInDatabase.length)

    const returnedImages = response.body.map(i => i.url)
    imagesInDatabase.forEach(image => {
      expect(returnedImages).toContain(image.url)
    })
  })

  test('individual images are returned as JSON by GET /api/images/:id', async () => {
    const imagesInDatabase = await imagesInDb()
    const anImage = imagesInDatabase[0]

    const response = await api
      .get(url + '/' + anImage.id)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('404 statuscode is returned when GET /api/images/:id is done with nonexistent valid id', async () => {
    const validNonexistingId = await nonExistingImageId()

    const response = await api
      .get(url + '/' + validNonexistingId)
      .expect(404)
  })

  test('404 statuscode is returned when GET /api/images/:id is done with invalid id', async () => {
    const invalidId = '7h31m4g3154l13'

    const response = await api
      .get(url + '/' + invalidId)
      .expect(404)
  })

  describe('addition of a new image', async () => {

    test('succesfully adds valid image by POST /api/images', async () => {
      const imagesAtStart = await imagesInDb()
      const newImage = {
        difficulty: 'easy',
        url: 'luu.jpg'
      }
      console.log(newImage)
      await api
        .post(url)
        .send(newImage)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const imagesAfterPost = await imagesInDb()
      expect(imagesAfterPost.length).toBe(imagesAtStart.length + 1)
      const urls = imagesAfterPost.map(i => i.url)
      expect(urls).toContain('luu.jpg')
    })

    test('400 statuscode is returned when POST /api/images is done with missing url', async () => {
      const imagesAtStart = await imagesInDb()
      const newImage = {
        difficulty: 'hard'
      }

      await api
        .post(url)
        .send(newImage)
        .expect(400)

      const imagesAfterPost = await imagesInDb()
      expect(imagesAfterPost.length).toBe(imagesAtStart.length)
    })

    test('400 statuscode is returned when POST /api/images is done with difficulty', async () => {
      const newImage = {
        url: 'image_without_urljpg'
      }

      const imagesAtStart = await imagesInDb()

      await api
        .post(url)
        .send(newImage)
        .expect(400)

      const imagesAfterPost = await imagesInDb()
      expect(imagesAfterPost.length).toBe(imagesAtStart.length)
    })
  })

  describe('updating an image', async () => {

    test('succesfully updates an image by PUT /image/api/:id with correct statuscode', async () => {
      const imagesAtStart = await imagesInDb()
      let imageToBeUpdated = imagesAtStart[0]
      imageToBeUpdated.difficulty = 'hard'

      await api
        .put(url + '/' + imageToBeUpdated.id)
        .send(imageToBeUpdated)
        .expect(200)

      const imagesAfterPut = await imagesInDb()
      const difficulties = imagesAfterPut.map(i => i.difficulty)
      expect(difficulties).toContain('hard')
    })

    test('400 statuscode is returned when PUT /api/images/:id is done with malformatted id', async () => {
      const imagesAtStart = await imagesInDb()
      const invalidId = '7h31m4g3154l13'
      let anImage = imagesAtStart[0]

      console.log(anImage)
      anImage = {
        id: invalidId,
        difficulty: 'extra hard'
      }

      console.log(anImage)
      await api
        .put(url + '/' + invalidId)
        .send(anImage)
        .expect(400)

      const imagesAfterPut = await imagesInDb()
      const difficulties = imagesAfterPut.map(i => i.difficulty)
      expect(imagesAfterPut.length).toBe(imagesAtStart.length)
      expect(difficulties).not.toContain('extra hard')
    })
  })


  afterAll(() => {
    server.close()
  })
})