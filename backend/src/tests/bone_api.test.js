const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Bone = require('../models/bone')
const { formatBone, initialBones, bonesInDb, nonExistingBoneId } = require('./bone_test_helper')

const url = '/api/bones'

describe('when there is initially some bones saved', async () => {
  beforeAll(async () => {
   jest.setTimeout(30000)
    await Bone.remove({})
    const boneObjects = initialBones.map(b => new Bone(b))
    await Promise.all(boneObjects.map(b => b.save()))
  })

  test('all bones are returned as JSON by GET /api/bones', async () => {
    const bonesInDatabase = await bonesInDb()
    const response = await api
      .get(url)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(bonesInDatabase.length)

    const returnedBones = response.body.map(b => b.name)
    bonesInDatabase.forEach(bone => {
      expect(returnedBones).toContain(bone.name)
    })
  })

  test('individual bones are returned as JSON by GET /api/bones/:id', async () => {
    const bonesInDatabase = await bonesInDb()
    const aBone = bonesInDatabase[0]

    const response = await api
      .get(url + '/' + aBone.id)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.name).toBe(aBone.name)
  })

  test('404 status is returned when GET /api/bones/:id is done with nonexistent valid id', async () => {
    const validNonexistingId = await nonExistingBoneId()

    const response = await api
      .get(url + '/' + validNonexistingId)
      .expect(404)
  })

  test('404 statuscode is returned when GET /api/bones/:id is done with invalid id', async () => {
    const invalidId = '7h3b0n3154l13'

    const response = await api
      .get(url + '/' + invalidId)
      .expect(404)
  })

  describe('addition of a new bone', async () => {

    test('succesfully adds valid bone by POST /api/bones', async () => {
      const bonesAtStart = await bonesInDb()

      const newBone = {
        name: 'reisiluu',
        nameLatin: 'ossis femoris'
      }

      await api
        .post(url)
        .send(newBone)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const bonesAfterPost = await bonesInDb()
      expect(bonesAfterPost.length).toBe(bonesAtStart.length + 1)
      const names = bonesAfterPost.map(b => b.name)
      expect(names).toContain('reisiluu')
    })

    test('400 statuscode is returned when POST /api/bones is done with missing name', async () => {
      const bonesAtStart = await bonesInDb()
      const newBone = {
        nameLatin: "oblivio"
      }

      await api
        .post(url)
        .send(newBone)
        .expect(400)

      const bonesAfterPost = await bonesInDb()
      expect(bonesAfterPost.length).toBe(bonesAtStart.length)
    })

    test('400 statuscode is returned when POST /api/bones is done with missing latin name', async () => {
      const bonesAtStart = await bonesInDb()
      const newBone = {
        name: "luu"
      }

      await api
        .post(url)
        .send(newBone)
        .expect(400)

      const bonesAfterPost = await bonesInDb()
      expect(bonesAfterPost.length).toBe(bonesAtStart.length)
    })
  })

  describe('updating a bone', async () => {

    test('successfully updates a bone by PUT /api/bone/:id with correct statuscode', async () => {
      const bonesAtStart = await bonesInDb()
      let boneToBeUpdated = bonesAtStart[0]
      let oldName = boneToBeUpdated.name

      boneToBeUpdated.name = 'new bone'

      await api
        .put(url + '/' + boneToBeUpdated.id)
        .send(boneToBeUpdated)
        .expect(200)

      const bonesAfterPut = await bonesInDb()
      const names = bonesAfterPut.map(b => b.name)
      expect(names).toContain('new bone')
      expect(names).not.toContain(oldName)
    })

    test('400 statuscode is returned when PUT /api/bones/:id is done with malformatted id', async () => {
      const bonesAtStart = await bonesInDb()
      const invalidId = '7h3b0n3154l13'
      const aBone = {
        name: 'huono iideeluu',
        nameLatin: 'ossis vilis id'
      }

      await api
        .put(url + '/' + invalidId)
        .send(aBone)
        .expect(400)

      const bonesAfterPut = await bonesInDb()
      const names = bonesAfterPut.map(b => b.name)
      expect(bonesAfterPut.length).toBe(bonesAtStart.length)
      expect(names).not.toContain('huono iideeluu')
    })

  })

  describe('deletion of a bone', async () => {
    let addedBone

    beforeAll(async () => {
      addedBone = new Bone({
        name: 'poistoluu',
        nameLatin: 'ossis deletus'
      })
      await addedBone.save()
    })

    test('succesfully deletes a bone by DELETE /api/bones:id with correct statuscode', async () => {
      const bonesAtStart = await bonesInDb()

      await api
        .delete(url + '/' + addedBone._id)
        .expect(204)

      const bonesAfterDelete = await bonesInDb()
      const names = bonesAfterDelete.map(b => b.name)
      expect(names).not.toContain(addedBone.name)
      expect(bonesAfterDelete.length).toBe(bonesAtStart.length - 1)
    })

    test('status code 400 is returned when trying to delete a nonexistent bone', async () => {
      const badId = 'ghgryh7'

      await api
        .delete(url + '/' + badId)
        .expect(400)
    })
  })

  // Closes server after tests
  afterAll(() => {
    server.close()
  })

})