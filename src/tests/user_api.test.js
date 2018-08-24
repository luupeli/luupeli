const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const { usersInDb, initialUsers1 } = require('./user_test_helper')

const url = '/api/users'

describe.only('when there is initially one user in database', async () => {
  beforeAll(async () => {
    jest.setTimeout(30000)
    await User.remove({})
    const userObjects = initialUsers1.map(u => new User(u))
    await Promise.all(userObjects.map(u => u.save()))
  })

  test('an individual existing user is returned with status code 200 by GET /api/users/:id', async () => {
    const users = await usersInDb()
    const user = users[0]

    const response = await api
      .get(url + '/' + user.id)
      .expect(200)

    expect(response.body.username).toBe(user.username)
  })

  test('status code 404 is returned when attempting to GET /api/users/:id where id is nonexistent', async () => {
    const badId = "n0n3x15t3nt"

    const response = await api
      .get(url + '/' + badId)
      .expect(404)
  })

  describe('addition of a new user', async () => {

    test('succesfully adds valid user by POST /api/users without an email', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'tykkaanluistajee',
        password: 'luuluuluu'
      }

      await api
        .post(url)
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAfterPost = await usersInDb()
      expect(usersAfterPost.length).toBe(usersAtStart.length + 1)

      const usernames = usersAfterPost.map(u => u.username)
      expect(usernames).toContain('tykkaanluistajee')

      var i
      for (i = 0; i < usersAfterPost.length; i++) {
        if (usersAfterPost[i].username === 'tykkaanluistajee') {
          expect(usersAfterPost[i].email).toBe(null)
        }
      }
    })

    test('succesfully adds valid user by POST /api/users with an email', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'sukkasaukko',
        email: 'leluelukka@luu.lol',
        password: 'kissakiisseli'
      }

      await api
        .post(url)
        .send(newUser)

      const usersAfterPost = await usersInDb()
      expect(usersAfterPost.length).toBe(usersAtStart.length + 1)

      const emails = usersAfterPost.map(u => u.email)
      expect(emails).toContain('leluelukka@luu.lol')

    })

    test('status code 400 is returned when attempting to POST /api/users is done with missing name', async () => {
      const usersAtStart = await usersInDb()
      const newUser = {
        password: 'entykkaaluista'
      }

      await api
        .post(url)
        .send(newUser)
        .expect(400)

      const usersAfterPost = await usersInDb()
      expect(usersAfterPost.length).toBe(usersAtStart.length)
    })

    test('status code 400 is returned when attempting to POST /api/users is done with missing password', async () => {
      const usersAtStart = await usersInDb()
      const newUser = {
        username: 'nomorebones'
      }

      await api
        .post(url)
        .send(newUser)
        .expect(400)

      const usersAfterPost = await usersInDb()
      expect(usersAfterPost.length).toBe(usersAtStart.length)
    })

    test('status code 400 is returned when attempting to POST /api/users is done with insufficient username', async () => {
      const usersAtStart = await usersInDb()
      const newUser = {
        username: 'lu',
        password: 'salasana'
      }

      await api
        .post(url)
        .send(newUser)
        .expect(400)

      const usersAfterPost = await usersInDb()
      expect(usersAfterPost.length).toBe(usersAtStart.length)
    })

    test('status code 400 is returned when attempting to POST /api/users is done with insufficient password', async () => {
      const usersAtStart = await usersInDb()
      const newUser = {
        username: 'luumies',
        password: 'sala'
      }

      await api
        .post(url)
        .send(newUser)
        .expect(400)

      const usersAfterPost = await usersInDb()
      expect(usersAfterPost.length).toBe(usersAtStart.length)
    })

    test('status code 400 is returned when attempting to POST /api/users is done with malformatted username', async () => {
      const usersAtStart = await usersInDb()
      const newUser = {
        username: 'xXx_.#luumies420_xXx',
        password: 'salasana'
      }

      await api
        .post(url)
        .send(newUser)
        .expect(400)

      const usersAfterPost = await usersInDb()
      expect(usersAfterPost.length).toBe(usersAtStart.length)
    })
  })

  describe('updating a user', async () => {

    test('succesfully updates username of a user by PUT /api/user/:id with correct statuscode', async () => {
      const usersAtStart = await usersInDb()
      let userToBeUpdated = usersAtStart[0]
      const oldUsername = userToBeUpdated.username
      userToBeUpdated.username = 'luidenharrastelija69'

      await api
        .put(url + '/' + userToBeUpdated.id)
        .send(userToBeUpdated)
        .expect(200)

      const usersAfterPut = await usersInDb()
      const usernames = usersAfterPut.map(u => u.username)
      expect(usernames).toContain('luidenharrastelija69')
      expect(usernames).not.toContain(oldUsername)
    })

    test('succesfully updates password of a user by PUT /api/user/:id with correct statuscode', async () => {
      const usersAtStart = await usersInDb()
      let userToBeUpdated = usersAtStart[0]
      const oldHash = userToBeUpdated.passwordHash

      const body = {
        password: 'uusisalasana'
      }

      await api
        .put(url + '/' + userToBeUpdated.id)
        .send(body)
        .expect(200)
      // Didn't come up with any valid way to check if the password changed
      // const usersAfterPut = await usersInDb()
      // const hashes = usersAfterPut.map(u => u.passwordHash)
      // expect(hashes).not.toContain(oldHash)
    })

    test('succesfully updates username and password of a user by PUT /api/user/:id with correct statuscode', async () => {
      const usersAtStart = await usersInDb()
      let userToBeUpdated = usersAtStart[0]
      const oldHash = userToBeUpdated.passwordHash
      const oldUsername = userToBeUpdated.username
      userToBeUpdated.username = 'ennemminasualohjallakuinopiskellaluita'
      userToBeUpdated.password = 'uusisalasana123'

      await api
        .put(url + '/' + userToBeUpdated.id)
        .send(userToBeUpdated)
        .expect(200)

      const usersAfterPut = await usersInDb()
      const usernames = usersAfterPut.map(u => u.username)
      expect(usernames).toContain(userToBeUpdated.username)
      expect(usernames).not.toContain(oldUsername)
      // Didn't come up with any valid way to check if the password changed
      // const hashes = usersAfterPut.map(u => u.passwordHash)
      // expect(hashes).not.toContain(oldHash)
    })

    test('status code 400 is returned when attempting to PUT /api/users is done with existing username', async () => {
      const usersAtStart = await usersInDb()
      let someUser = usersAtStart[0]
      let userToBeUpdated = usersAtStart[1]
      const oldUsername = userToBeUpdated.username
      userToBeUpdated.username = someUser.username

      await api
        .put(url + '/' + userToBeUpdated.id)
        .send(userToBeUpdated)
        .expect(400)

      const usersAfterPut = await usersInDb()
      const usernames = usersAfterPut.map(u => u.username)
      expect(usernames).toContain(oldUsername)
    })
  })

  describe('deletion of a user', async () => {
    let newUser

    beforeAll(async () => {
      newUser = new User({
        username: 'luumuumi',
        password: 'ananaspizza8'
      })
      await newUser.save()
    })

    test('status code 204 is returned when successfully deleting a user', async () => {

      const users = await usersInDb()

      await api
        .delete(url + '/' + newUser._id)
        .expect(204)

      const usersNow = await usersInDb()
      expect(usersNow.length).toBe(users.length - 1)

    })

    test('status code 400 is returned when attempting to delete a nonexistent user', async () => {

      const badId = "1a2b3c"
      const users = await usersInDb()

      await api
        .delete(url + '/' + badId)
        .expect(400)

      const usersNow = await usersInDb()
      expect(usersNow.length).toBe(users.length)
    })
  })

  afterAll(() => {
    server.close()
  })
})